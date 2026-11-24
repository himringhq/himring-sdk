from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

from codegen.render_methods import render_methods
from codegen.render_operations import render_operations
from codegen.render_types import render_types
from codegen.spec_model import SPEC_DIRECTORY, SpecModelError, load_spec_model

PACKAGE_ROOT = Path(__file__).resolve().parents[1]
GENERATED_DIRECTORY = PACKAGE_ROOT / "src" / "himring" / "_generated"
GENERATE_COMMAND = "pnpm nx run sdk-python:generate"


class GeneratedFileDrift(Exception):
    pass


def _through_ruff(arguments: list[str], text: str, path: Path) -> str:
    completed = subprocess.run(
        [sys.executable, "-m", "ruff", *arguments, "--stdin-filename", str(path), "-"],
        input=text,
        capture_output=True,
        text=True,
        cwd=PACKAGE_ROOT,
        check=False,
    )
    if completed.returncode != 0:
        raise SpecModelError(f"ruff could not tidy {path.name}: {completed.stderr.strip()}")
    return completed.stdout


def formatted(text: str, name: str) -> str:
    path = GENERATED_DIRECTORY / name
    sorted_imports = _through_ruff(["check", "--select", "I", "--fix", "--quiet"], text, path)
    return _through_ruff(["format", "--quiet"], sorted_imports, path)


def rendered_files(spec_directory: Path, output_directory: Path) -> tuple[dict[str, str], int]:
    model = load_spec_model(spec_directory)
    types = render_types(model)
    sources = {
        "__init__.py": "",
        "types.py": types.text,
        "operations.py": render_operations(model, types),
        "sync_methods.py": render_methods(model, types, "sync"),
        "async_methods.py": render_methods(model, types, "async"),
    }
    files = {name: formatted(text, name) if text else text for name, text in sources.items()}
    return files, len(model.operations)


def _committed_text(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return None


def check(files: dict[str, str], output_directory: Path) -> None:
    stale = [
        name for name, text in files.items() if _committed_text(output_directory / name) != text
    ]
    if stale:
        raise GeneratedFileDrift(
            f"src/himring/_generated/{', '.join(stale)} differ from the spec. "
            f"Run {GENERATE_COMMAND} and commit."
        )


def write(files: dict[str, str], output_directory: Path) -> None:
    output_directory.mkdir(parents=True, exist_ok=True)
    for name, text in files.items():
        path = output_directory / name
        pending = path.with_name(f"{path.name}.{os.getpid()}.pending")
        try:
            pending.write_text(text, encoding="utf-8")
            os.replace(pending, path)
        finally:
            pending.unlink(missing_ok=True)


def main(arguments: list[str]) -> int:
    parser = argparse.ArgumentParser(prog="python -m codegen")
    parser.add_argument("mode", choices=("write", "check"))
    parser.add_argument("--spec-directory", type=Path, default=SPEC_DIRECTORY)
    parser.add_argument("--output-directory", type=Path, default=GENERATED_DIRECTORY)
    options = parser.parse_args(arguments)
    mode: str = options.mode
    spec_directory: Path = options.spec_directory
    output_directory: Path = options.output_directory
    try:
        files, count = rendered_files(spec_directory, output_directory)
        if mode == "check":
            check(files, output_directory)
            print(f"src/himring/_generated matches the spec for {count} operations.")
        else:
            write(files, output_directory)
            print(f"Wrote src/himring/_generated for {count} operations.")
    except (SpecModelError, GeneratedFileDrift, OSError, ValueError) as error:
        print(error, file=sys.stderr)
        return 1
    return 0

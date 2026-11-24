package himring

import (
	"bytes"
	"encoding/json"
)

type Nullable[T any] struct {
	value T
	set   bool
	null  bool
}

func Value[T any](value T) Nullable[T] {
	return Nullable[T]{value: value, set: true}
}

func Null[T any]() Nullable[T] {
	return Nullable[T]{null: true}
}

func Ptr[T any](value T) *T {
	return &value
}

func (nullable Nullable[T]) Get() (T, bool) {
	return nullable.value, nullable.set
}

func (nullable Nullable[T]) IsNull() bool {
	return !nullable.set
}

func (nullable Nullable[T]) IsZero() bool {
	return !nullable.set && !nullable.null
}

func (nullable Nullable[T]) MarshalJSON() ([]byte, error) {
	if !nullable.set {
		return []byte("null"), nil
	}
	return json.Marshal(nullable.value)
}

func (nullable *Nullable[T]) UnmarshalJSON(data []byte) error {
	if bytes.Equal(bytes.TrimSpace(data), []byte("null")) {
		*nullable = Null[T]()
		return nil
	}
	var value T
	if err := json.Unmarshal(data, &value); err != nil {
		return err
	}
	*nullable = Value(value)
	return nil
}

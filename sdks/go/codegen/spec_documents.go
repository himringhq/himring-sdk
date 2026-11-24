package main

import "net/url"

func errorCodesOf(document *jsonObject, place string) ([]errorCodeModel, error) {
	components, err := recordAt(document.value("components"), place+" components")
	if err != nil {
		return nil, err
	}
	schemas, err := recordAt(components.value("schemas"), place+" schemas")
	if err != nil {
		return nil, err
	}
	errorCode, err := recordAt(schemas.value("error_code"), place+" error_code")
	if err != nil {
		return nil, err
	}
	codes, err := recordAt(errorCode.value(errorCodesKeyword), place+" "+errorCodesKeyword)
	if err != nil {
		return nil, err
	}
	var found []errorCodeModel
	for _, code := range codes.keys {
		description, err := recordAt(codes.value(code), place+" error code "+code)
		if err != nil {
			return nil, err
		}
		status, isWhole := wholeNumberAt(description.value("status"))
		message, isText := description.value("message").(string)
		if !isWhole || !isText {
			return nil, failf("%s error code %s has no status and message.", place, code)
		}
		found = append(found, errorCodeModel{code: code, status: int(status), message: message})
	}
	return found, nil
}

func fileKindsOf(components *jsonObject, place string) ([]fileKindModel, error) {
	kinds, err := recordAt(components.value(fileKindsKeyword), place+" "+fileKindsKeyword)
	if err != nil {
		return nil, err
	}
	owners := map[string]string{}
	var found []fileKindModel
	for _, kind := range kinds.keys {
		if !operationIDPattern.MatchString(kind) {
			return nil, failf("%s lists the file kind %s.", place, kind)
		}
		extensions := listAt(kinds.value(kind))
		if len(extensions) == 0 {
			return nil, failf("%s lists no extensions for %s.", place, kind)
		}
		model := fileKindModel{kind: kind}
		for _, raw := range extensions {
			extension, isText := raw.(string)
			if !isText || !listedExtensionPattern.MatchString(extension) {
				return nil, failf("%s lists %v for %s.", place, raw, kind)
			}
			if owner, owned := owners[extension]; owned {
				return nil, failf("%s lists %s for %s and %s.", place, extension, owner, kind)
			}
			owners[extension] = kind
			model.extensions = append(model.extensions, extension)
		}
		found = append(found, model)
	}
	if len(found) == 0 {
		return nil, failf("%s lists no file kinds.", place)
	}
	return found, nil
}

func serverURLOf(document *jsonObject, place string) (string, error) {
	servers := listAt(document.value("servers"))
	var first *jsonObject
	if len(servers) > 0 {
		first = optionalRecord(servers[0])
	}
	address, err := textAt(first.value("url"), place+" servers[0].url")
	if err != nil {
		return "", err
	}
	parsed, err := url.Parse(address)
	if err != nil || parsed.Scheme != "https" || parsed.Hostname() == "" {
		return "", failf("%s gives %s as its first server, which is not an https URL.", place, address)
	}
	return address, nil
}

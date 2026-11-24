package answers

type recorderWarning struct {
	message string
	details map[string]any
}

func (recorder *Recorder) warn(message string, details map[string]any) {
	recorder.warningsMutex.Lock()
	defer recorder.warningsMutex.Unlock()
	if len(recorder.warnings) >= recorder.maximumBuffered {
		return
	}
	recorder.warnings = append(recorder.warnings, recorderWarning{message: message, details: details})
	if !recorder.warningActive {
		recorder.warningActive = true
		go recorder.deliverWarnings()
	}
}

func (recorder *Recorder) deliverWarnings() {
	for {
		recorder.warningsMutex.Lock()
		if len(recorder.warnings) == 0 {
			recorder.warningActive = false
			recorder.warningsMutex.Unlock()
			return
		}
		warning := recorder.warnings[0]
		recorder.warnings[0] = recorderWarning{}
		recorder.warnings = recorder.warnings[1:]
		recorder.warningsMutex.Unlock()
		recorder.deliverWarning(warning)
	}
}

func (recorder *Recorder) deliverWarning(warning recorderWarning) {
	defer func() {
		recover()
	}()
	recorder.logger.Warn(warning.message, warning.details)
}

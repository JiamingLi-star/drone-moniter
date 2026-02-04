package logic

import (
	"fmt"
	"regexp"
	"time"
)

const defaultRangeHours = 24

func parseTimeRange(startStr, endStr string) (time.Time, time.Time, error) {
	now := time.Now().UTC()
	if startStr == "" && endStr == "" {
		return now.Add(-defaultRangeHours * time.Hour), now, nil
	}

	var start time.Time
	var end time.Time
	var err error

	if startStr != "" {
		start, err = parseAnyTime(startStr)
		if err != nil {
			return time.Time{}, time.Time{}, fmt.Errorf("invalid start time: %w", err)
		}
	} else {
		start = now.Add(-defaultRangeHours * time.Hour)
	}

	if endStr != "" {
		end, err = parseAnyTime(endStr)
		if err != nil {
			return time.Time{}, time.Time{}, fmt.Errorf("invalid end time: %w", err)
		}
	} else {
		end = now
	}

	if end.Before(start) {
		return time.Time{}, time.Time{}, fmt.Errorf("end time before start time")
	}
	return start.UTC(), end.UTC(), nil
}

func parseAnyTime(value string) (time.Time, error) {
	layouts := []string{
		time.RFC3339,
		"2006-01-02 15:04:05",
		"2006-01-02",
	}
	for _, layout := range layouts {
		if t, err := time.Parse(layout, value); err == nil {
			return t, nil
		}
	}
	return time.Time{}, fmt.Errorf("unsupported time format: %s", value)
}

var windowRe = regexp.MustCompile(`^[0-9]+(s|m|h|d|w)$`)

func normalizeWindow(window string) string {
	if window == "" {
		return "1h"
	}
	if windowRe.MatchString(window) {
		return window
	}
	return "1h"
}

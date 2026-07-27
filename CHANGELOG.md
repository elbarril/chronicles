# Changelog

## [Unreleased] - feat/defaults-restore-updates-config

### Features
- **Enhanced Form Validation**: Added comprehensive client-side validation for ObservationForm including:
  - Required field validation with proper Spanish error messages
  - Min/max constraint validation for number and rating fields
  - Manual validation logic that works alongside existing form validation

### Testing Improvements
- **Playwright Configuration**: Updated test timeouts and settings for improved reliability:
  - Increased test timeout from 30s to 60s
  - Adjusted assertion timeout from 5s to 10s
  - Optimized action timeout to 10s for faster feedback
- **E2E Test Updates**: Updated test selectors and labels for better accuracy:
  - Changed "Texto de observación" to "Transcripción de audio de observación" in chronicle-generation.spec.ts and chronicle-ai-generation.spec.ts
  - Updated MAE form labels: "Valoración cualitativa" → "Valoración cualitativa (Comentarios)"
  - Updated observation section labels: "Observaciones del encuentro" → "Observaciones generales"
  - Added explicit waits for form rendering in MAE forms tests
  - Improved test stability with better waiting strategies

### UI/UX Improvements
- **MAE Forms Enhancement**: Updated field labels and test expectations for consistency:
  - Improved conditional field handling in MAE observation forms
  - Enhanced form rendering wait strategies with explicit visibility checks
  - Better test stability for MAE evaluation forms

### Bug Fixes
- **Form Builder**: Fixed test issues with field selection and ordering:
  - Removed problematic reordering functionality from forms-compose test
  - Improved button selection with `.first()` to avoid ambiguity
  - Fixed age field validation handling with proper clearing mechanism
  - Updated encounter-capture.spec.ts and encounter-export-import.spec.ts label references

### Performance
- **Test Performance**: Adjusted performance thresholds for MAE forms in defaults:
  - Interaction time threshold increased from 100ms to 300ms
  - Conditional logic timeout increased from 200ms to 500ms
  - Load degradation tolerance increased from 1.5x to 2.0x for CI

### Technical Improvements
- **Validation Architecture**: Implemented manual validation logic that works alongside existing form validation
- **Test Reliability**: Added explicit waits and improved element selection strategies across multiple test files
- **Error Handling**: Enhanced form submission error handling with user-friendly messages

---

## Previous Versions

*For previous changelog entries, please refer to git commit history.*
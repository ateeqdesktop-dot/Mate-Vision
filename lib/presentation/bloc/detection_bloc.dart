import 'package:flutter_bloc/flutter_bloc.dart';
import '../../core/constants.dart';
import '../../core/exceptions.dart';
import '../../domain/usecases/detect_car_accident_usecase.dart';
import '../../domain/usecases/detect_weapon_usecase.dart';
import 'detection_event.dart';
import 'detection_state.dart';

/// BLoC for managing detection state
class DetectionBloc extends Bloc<DetectionEvent, DetectionState> {
  final DetectCarAccidentUseCase _detectCarAccidentUseCase;
  final DetectWeaponUseCase _detectWeaponUseCase;

  DetectionBloc({
    required DetectCarAccidentUseCase detectCarAccidentUseCase,
    required DetectWeaponUseCase detectWeaponUseCase,
  })  : _detectCarAccidentUseCase = detectCarAccidentUseCase,
        _detectWeaponUseCase = detectWeaponUseCase,
        super(const DetectionInitial()) {
    on<SelectImage>(_onSelectImage);
    on<ClearImage>(_onClearImage);
    on<StartDetection>(_onStartDetection);
    on<ResetDetection>(_onResetDetection);
  }

  void _onSelectImage(SelectImage event, Emitter<DetectionState> emit) {
    emit(ImageSelected(
      imageBytes: event.imageBytes,
      fileName: event.fileName,
    ));
  }

  void _onClearImage(ClearImage event, Emitter<DetectionState> emit) {
    emit(const DetectionInitial());
  }

  Future<void> _onStartDetection(
    StartDetection event,
    Emitter<DetectionState> emit,
  ) async {
    emit(DetectionLoading(
      imageBytes: event.imageBytes,
      fileName: event.fileName,
    ));

    try {
      final result = switch (event.detectionType) {
        DetectionType.carAccident => await _detectCarAccidentUseCase(
            event.imageBytes,
            event.fileName,
          ),
        DetectionType.weapon => await _detectWeaponUseCase(
            event.imageBytes,
            event.fileName,
          ),
      };

      emit(DetectionSuccess(
        result: result,
        imageBytes: event.imageBytes,
        fileName: event.fileName,
      ));
    } on NetworkException catch (e) {
      emit(DetectionError(
        message: 'Network error: ${e.message}',
        imageBytes: event.imageBytes,
        fileName: event.fileName,
      ));
    } on ServerException catch (e) {
      emit(DetectionError(
        message: 'Server error: ${e.message}',
        imageBytes: event.imageBytes,
        fileName: event.fileName,
      ));
    } catch (e) {
      emit(DetectionError(
        message: 'An unexpected error occurred: $e',
        imageBytes: event.imageBytes,
        fileName: event.fileName,
      ));
    }
  }

  void _onResetDetection(ResetDetection event, Emitter<DetectionState> emit) {
    emit(const DetectionInitial());
  }
}

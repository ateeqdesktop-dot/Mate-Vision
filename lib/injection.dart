import 'package:get_it/get_it.dart';

import 'data/datasources/api_client.dart';
import 'data/repositories/prediction_repository_impl.dart';
import 'domain/repositories/prediction_repository.dart';
import 'domain/usecases/detect_car_accident_usecase.dart';
import 'domain/usecases/detect_weapon_usecase.dart';
import 'presentation/bloc/detection_bloc.dart';
import 'presentation/bloc/theme_cubit.dart';

final getIt = GetIt.instance;

/// Initialize all dependencies
void initializeDependencies() {
  // Data Sources
  getIt.registerLazySingleton<ApiClient>(() => ApiClient());

  // Repositories
  getIt.registerLazySingleton<PredictionRepository>(
    () => PredictionRepositoryImpl(getIt<ApiClient>()),
  );

  // Use Cases
  getIt.registerFactory<DetectCarAccidentUseCase>(
    () => DetectCarAccidentUseCase(getIt<PredictionRepository>()),
  );

  getIt.registerFactory<DetectWeaponUseCase>(
    () => DetectWeaponUseCase(getIt<PredictionRepository>()),
  );

  // BLoCs
  getIt.registerFactory<DetectionBloc>(
    () => DetectionBloc(
      detectCarAccidentUseCase: getIt<DetectCarAccidentUseCase>(),
      detectWeaponUseCase: getIt<DetectWeaponUseCase>(),
    ),
  );

  getIt.registerFactory<ThemeCubit>(() => ThemeCubit());
}

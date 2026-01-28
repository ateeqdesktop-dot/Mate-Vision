import 'package:flutter_test/flutter_test.dart';
import 'package:mate_vision_app/main.dart';
import 'package:mate_vision_app/injection.dart';

void main() {
  setUp(() {
    initializeDependencies();
  });

  tearDown(() {
    getIt.reset();
  });

  testWidgets('MateVisionApp widget test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MateVisionApp());
    
    // Pump frames to allow animations to complete
    await tester.pumpAndSettle(const Duration(seconds: 2));

    // Verify that the app title appears
    expect(find.text('Mate Vision'), findsWidgets);
  });
}

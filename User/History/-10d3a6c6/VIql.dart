import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class LaunchFocalPointNotifier extends Notifier<Offset?> {
  @override
  Offset? build() {
    return null;
  }

  void setOffset(Offset? offset) {
    state = offset;
  }
}

final launchFocalPointProvider = NotifierProvider<LaunchFocalPointNotifier, Offset?>(LaunchFocalPointNotifier.new);

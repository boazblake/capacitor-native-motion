Pod::Spec.new do |s|
  s.name                     = 'CapacitorNativeMotion' 
  s.version                  = '0.1.0' # Should match your package.json version
  s.summary                  = 'High-performance native motion streaming for Capacitor.'
  s.license                  = 'MIT'
  s.homepage                 = 'https://github.com/boazblake/capacitor-native-motion'
  s.author                   = 'Boaz Blake'
  s.source                   = { :path => '.' } 
  s.source_files             = 'Plugin/**/*.{swift,h,m}' 
  s.ios.deployment_target    = '13.0'
  s.dependency                 'Capacitor'
  s.swift_version              = '5.0' # Use a widely compatible Swift version
  s.static_framework         = true
end

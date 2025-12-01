// swift-tools-version:5.5

import PackageDescription

let package = Package(
    name: "CapacitorNativeMotion",
    platforms: [
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "CapacitorNativeMotion",
            targets: ["CapacitorNativeMotion"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-package.git", from: "6.0.0")
    ],
    targets: [
        .target(
            name: "CapacitorNativeMotion",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-package"),
                .product(name: "Cordova", package: "capacitor-swift-package")
            ],
            path: "ios/Plugin"
        )
    ]
)

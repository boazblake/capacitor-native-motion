{
  description = "Capacitor Motion dev shell with CocoaPods";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";

  outputs = { self, nixpkgs }:
    let
      system = "aarch64-darwin"; # for M1/M2 Macs
      pkgs = import nixpkgs { inherit system; };
    in {
      devShells.${system}.default = pkgs.mkShell {
        name = "cap-motion-shell";
        buildInputs = with pkgs; [
          ruby
          cocoapods
          nodejs_20
          git
        ];
        shellHook = ''
          export PATH=$PATH:$HOME/.gem/ruby/*/bin
          echo "CocoaPods available: $(pod --version)"
        '';
      };
    };
}

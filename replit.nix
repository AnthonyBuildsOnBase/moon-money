{ pkgs }: {
	deps = [
   pkgs.imagemagick_light
		pkgs.nodejs
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
	];
}
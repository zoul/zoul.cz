site:
	jekyll build
upload: site
	rsync -pvtrlL --exclude Makefile --cvs-exclude --delete _site/ cirdan:websites/zmotula.cz
clean:
	rm -rf _site

site:
	jekyll build
upload: site
	rsync -pvtrlL --exclude Makefile --cvs-exclude --delete _site/ cirdan:websites/zoul.cz
clean:
	rm -rf _site

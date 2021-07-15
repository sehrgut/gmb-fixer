const	cheerio		= require('cheerio'),
		fs			= require('fs'),
		jsdom		= require('jsdom'),
		fmt			= require('util').format;

const fb_pixel_start = '<!-- Facebook Pixel Code -->';
const fb_pixel_end = '<!-- End Facebook Pixel Code -->';

function remove_fb_pixel(html) {
	const re_fbPixel = new RegExp(fb_pixel_start + '[\\s\\S]*' + fb_pixel_end);
	
	return html.replace(re_fbPixel, '');
}

function remove_between(start_fn, end_fn) {
// todo: match between selectors as well
// todo: removeMarkers = (true|false)
	let started = false;	

	this.contents().each((i, el) => {
		let remove = started;
		let retval = true;
		
		if (!started && start_fn(el)) {
			started = true;
			remove = true;
			
		} else if (started && end_fn(el)) {
			started = false;
			retval = false; // todo: do_once vs do_multiple
		}
		
		if (remove) this.find(el).remove();
	});
	return this;
}


function fix_dom(html) {
	const $ = cheerio.load(doc);
	$.fn.remove_between = remove_between;
	
	//remove_between_comments($('head'), ' Facebook Pixel Code ', ' End Facebook Pixel Code ');
	
	$('head').remove_between(
		el => el.type === 'comment' && el.data === ' Facebook Pixel Code ',
		el => el.type === 'comment' && el.data === ' End Facebook Pixel Code '
	);
	
	const section_headers = $('section > :first-child:is(h1,h2,h3,h4,h5,h6)');
	section_headers.each((i, el) => { el.parent.attribs.id += '-section'; });

	const links = $('a[href^="https://editor.gmbinder.com/#"]')
	links.each((i, el) => { el.attribs.href = el.attribs.href.replace(/^https:\/\/editor\.gmbinder\.com\/#/, '#'); })
	
	$('base').remove();
	
	return $.html();
}

var doc = fs.readFileSync(process.stdin.fd).toString();

//doc = remove_fb_pixel(doc);
doc = fix_dom(doc);

process.stdout.write(doc);










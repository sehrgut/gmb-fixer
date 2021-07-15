#!/usr/bin/env node
const	cheerio		= require('cheerio'),
		fs			= require('fs'),
		jsdom		= require('jsdom'),
		fmt			= require('util').format;

/*
 * todo: wrap in a class for ease of utilifying?
 * todo: give it a standard shell utility interface
 * todo: wget mode to fetch and fix based on share URL
 * todo: break remove_between out into a proper plugin?
 */


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

function do_remove_facebook_pixel($) {
	const fb_pixel_start = '<!-- Facebook Pixel Code -->';
	const fb_pixel_end = '<!-- End Facebook Pixel Code -->';

	$.fn.remove_between = remove_between;
	
	$('head').remove_between(
		el => el.type === 'comment' && el.data === ' Facebook Pixel Code ',
		el => el.type === 'comment' && el.data === ' End Facebook Pixel Code '
	);
	
	delete $.fn.remove_between;
}

function do_relativize_links($) {
	const links = $('a.custom-internal-link');
	console.error("Making %d links local", links.length);
	links.each((i, el) => {
		const u = new URL(el.attribs.href);
		if (u.hash.length)
			el.attribs.href = u.hash;
	});
}

function do_fix_section_headers($) {
	const section_headers = $('section > :first-child:is(h1,h2,h3,h4,h5,h6)');
	console.error("Fixing %d section header IDs", section_headers.length)
	section_headers.each((i, el) => { el.parent.attribs.id += '-section'; });
}

function fix_dom(html) {
	const $ = cheerio.load(html);

	do_remove_facebook_pixel($);
	do_fix_section_headers($);
	do_relativize_links($);	

	$('base').remove();
	
	return $.html();
}

const doc_in	= fs.readFileSync(process.stdin.fd).toString();
const doc_out	= fix_dom(doc_in);

process.stdout.write(doc_out);










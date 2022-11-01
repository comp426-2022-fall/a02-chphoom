#!/usr/bin/env node

//imports
import minimist from 'minimist';
import moment from "moment-timezone";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

if (args.h) {
	printHelp();
	process.exit(0);
}

function printHelp() { //helper function
	console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
	console.log( "-h           Show this help message and exit.")
	console.log("-n, -s        Latitude: N positive; S negative.")
	console.log("-e, -w        Longitude: E positive; W negative.")
	console.log("-z            Time zone: uses tz.guess() from moment-timezone by default.")
	console.log("-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.")
	console.log("-j            Echo pretty JSON from open-meteo API and exit.")
}//end help

let d = args.d;
let latitude=0;
let longitude=0; 

if(args.n && !args.s){
	latitude = args.n;
} else if(args.s && !args.n){
	latitude = -1 * args.s;
} else {
	console.log("Latitude must be in range");
	//process.exit(1);
}

if(args.e && !args.w){
	longitude = args.e;
} else if(args.w && !args.e){
	longitude = -1 * args.w;
} else {
	console.log("Longitude must be in range");
	//process.exit(1);
}

let timezone =  args.z ? args.z : moment.tz.guess();
//use tz.guest by default

// Make a request
//latitude and longitude constants

//fetch API call

const base_url = "https://api.open-meteo.com/v1/forecast"

const data_string = "latitude=" + latitude + "&longitude=" + longitude +"&daily=precipitation_hours&timezone=" + timezone

const url = base_url + "?" + data_string

const response = await fetch(url);
// Get the data from the request
const data = await response.json();

if(data.error) {
	console.log(data.reason + "\n");
	process.exit(1);
}else if(args.j) {
	console.log(data);
    process.exit(0);
}

const days = args.d 

// Below, we've defined days corresponding to the command line argument -d. We'll assume args is defined from minimist's output, which is the parsed command line arguments.
if (days == 0) {
	if(data.daily.precipitation_hours[days] != 0){
		console.log("You might need your galoshes");
	}else{
		console.log("You will not need your galoshes");
	}
  console.log("today.")
} else if (days > 1) {
	if(data.daily.precipitation_hours[days] != 0){
		console.log("You might need your galoshes");
	}else{
		console.log("You will not need your galoshes");
	}
  console.log("in " + days + " days.")
} else {
	if(data.daily.precipitation_hours[days] != 0){
		console.log("You might need your galoshes");
	}else{
		console.log("You will not need your galoshes");
	}
  console.log("tomorrow.")
}

console.log(data);
process.exit(0);
// regex credits: https://regex101.com/
var nameWithSpaceRegex = /^[a-zA-Z\'\-\.\s]+$/;
var nameWithSpaceAndNumbersRegex = /^[a-zA-Z\d\'\-\.\s]+$/;
var addressRegex = /^[a-zA-Z\d\'\-\.\s\,\#\/]+$/;
var numberRegex = /^[\d]+$/;
var moneyRegex = /^(\d)+(.\d\d)?$/;
var emailRegex = /^[a-zA-Z\d\_\-\.]+\@[a-zA-Z\d\_\-]+(\.[a-z]+){1,2}$/;
var longDescriptionRegex = /^[a-zA-Z\d\(\)\&\,\;\'\-\.\s]+$/;
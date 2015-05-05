gauge = new gauge({
  tags: ['0', '1', '2', '3', '4', '5', '6','7','8','9'],
  divisionSep: 9
})

gauge.setValue('deg','0');

setTimeout(function(){
  gauge.setValue('string','7');
}, 2000)
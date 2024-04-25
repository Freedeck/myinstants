console.log('I\'m a Companion/Server hook!')

universal.listenFor('button', (interaction) => {
	if(interaction.type != 'mi.sound') return;
	const url = interaction.data.url;
	const sending = {event:{isTrusted: true},btn: interaction}
	interaction.data = {path: '', file: ''}
	fetch('http://localhost:5575/' + url).then(res=>res.json()).then(res => {
		interaction.type = 'fd.sound'; // convert to sound so freedeck processes it properly
		interaction.data.path = res.path;
		interaction.data.file = res.file;
		universal.send(universal.events.keypress, JSON.stringify(sending));
	})
})
            var windowMinWidth = 800
            var windowMinHeight = 800;
            var canvasHeightRatio = 0.6;
            
            function initialize() {
                window.addEventListener('resize', updateGraph, false);
                initializeSelector();
                updateGraph();
            }
            function updateGraph() {
                //get selector value
                var e = document.getElementById("selector");
                var q = e.options[e.selectedIndex].value;
                var qNumber = parseInt(q);

                var selectedParties = [];
                var checkboxes = document.getElementById("partyCheckboxes").getElementsByTagName("input");
                for (var i = 0; i < checkboxes.length; i++)
                {
                	if (checkboxes[i].checked == true)
                		selectedParties.push(i);
                }

                //update nav Buttons if first or last question
                if (qNumber == 1) {
                    document.getElementById("backButton").disabled = true;
                    document.getElementById("fwdButton").disabled = false;
                } else if (qNumber == 30) {
                    document.getElementById("fwdButton").disabled = true;
                    document.getElementById("backButton").disabled = false;
                } else {
                    document.getElementById("fwdButton").disabled = false;
                    document.getElementById("backButton").disabled = false;
                }

                //resize and clear canvas
                var canvas = document.getElementById("canvas");
                if (window.innerWidth > windowMinWidth) {
                    canvas.width = window.innerWidth;
                } else {
                    canvas.width = windowMinWidth;
                }
                if (window.innerHeight > windowMinHeight) {
                    canvas.height = window.innerHeight*canvasHeightRatio;
                } else {
                    canvas.height = windowMinHeight*canvasHeightRatio;
                }
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                //update question text
                var qText = document.getElementById("questionText");
                qText.innerHTML = questions[(qNumber - 1)];
                qText.style.fontSize = (Math.floor(canvas.width / 200) + 15) + "px";
                qText.style.fontWeight = 700;
				qText.style.fontFamily = "Arial, Helvetica, sans-serif";

                drawGrid(ctx);

                //populate graph
                var withEos = document.getElementById("scale");
                if (withEos.checked) {
                    for (i = 0; i < selectedParties.length; i++) { 
                    	j = selectedParties[i];
	                    drawDotAndLine(valuesWithEos[(j * 2 + (qNumber - 1) * 24)], i, valuesWithEos[(j * 2 + (qNumber - 1) * 24 + 1)], j, true, ctx, selectedParties.length);
	                    writePartyName(i, j, ctx, selectedParties.length);
                	}
                } else {
                    for (i = 0; i < selectedParties.length; i++) { 
                    	j = selectedParties[i];
	                    drawDotAndLine(values[(j * 2 + (qNumber - 1) * 24)], i, values[(j * 2 + (qNumber - 1) * 24 + 1)], j, false, ctx, selectedParties.length);
	                    writePartyName(i, j, ctx, selectedParties.length);
                	}
                }               
            }
            
            function drawDotAndLine(x, y, deviation, party, withEos, ctx, numberOfSelectedParties) {
                ctx.strokeStyle = partyColors[party];
                var scale = withEos ? 4 : 3;

             	ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.arc((50 + (x - 1) * canvas.width * 0.65 / scale),(45 + y * canvas.height / (numberOfSelectedParties + 1)), 5, 0, 2 * Math.PI);
                ctx.stroke();

                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo((50 + (x - 1) * canvas.width * 0.65 / scale) - (deviation * canvas.width) * 0.5 * 0.65 / scale, (45 + y * canvas.height / (numberOfSelectedParties + 1)));
                ctx.lineTo((50 + (x - 1) * canvas.width * 0.65 / scale) + (deviation * canvas.width) * 0.5 * 0.65 / scale, (45 + y * canvas.height / (numberOfSelectedParties + 1)));
                ctx.stroke(); 
            }
            
            function writePartyName(position, partyNumber, ctx, numberOfSelectedParties) {
                ctx.font = (parties.length + Math.floor(canvas.height / 100)) + "px Arial";
                ctx.fillStyle = partyColors[partyNumber];
                ctx.fillText(parties[partyNumber], 60 + canvas.width * 0.65, (50 + position * canvas.height / (numberOfSelectedParties + 1)));
            }
            
            function drawGrid(ctx) {
        	    ctx.strokeStyle="#CCCCCC";
                ctx.fillStyle="#F8F8F8";
                ctx.fillRect(50, 20, canvas.width * 0.65, canvas.height - 20);
                ctx.fillStyle="#777777";
                ctx.font = "16px Arial";
                ctx.fillText("täysin eri mieltä", 50, 15);
                ctx.fillText("täysin samaa mieltä", canvas.width * 0.65 - 90, 15);

                var e = document.getElementById("scale");
                var scale = e.checked ? 4 : 3;
                for (i = 0; i < scale + 1; i++) 
                {
                    ctx.beginPath();
                    ctx.moveTo(50 + canvas.width * i * (0.65 / scale), 20);
                    ctx.lineTo(50 + canvas.width * i * (0.65 / scale), canvas.height);
                    ctx.stroke();
                }               
            }
            
            function previousQ() {
                var e = document.getElementById("selector");
                var q = e.options[e.selectedIndex].value;
                var qNumber = parseInt(q);
                if (qNumber > 1) {
                    e.selectedIndex--;
                    updateGraph();
                }
            }
            
            function nextQ() {
                var e = document.getElementById("selector");
                var q = e.options[e.selectedIndex].value;
                var qNumber = parseInt(q);
                if (qNumber < 30) {
                    e.selectedIndex++;
                    updateGraph();
                }
            }
            
            function initializeSelector() {
                var selector = document.getElementById("selector");
                selector.size = "1";
                for(var i = 0; i < questions.length; i++) {
                	var option = document.createElement("option");
                	option.text = (i + 1) + ": " + getSelectorText(questions[i]);
                    selector.add(option, selector[i]);
                }
                selector.selectedIndex = "0";
                selector.multiple = false;

                var partyCheckboxes = document.getElementById("partyCheckboxes");

                for (var i = 0; i < parties.length; i++)
                {
                	var partyCheckbox = document.createElement("span");
                	partyCheckbox.className = "nowrap";
                	var checkbox = document.createElement("input");
                	checkbox.type = "checkbox";
                	checkbox.className = "partyCheckbox";
                	checkbox.value = parties[i];
                	checkbox.checked = true;
                	checkbox.onclick = function() {updateGraph();};
                	partyCheckbox.appendChild(checkbox);
                	var partyText = document.createElement("span");
                	partyText.innerHTML = "&nbsp" + parties[i];
                	partyCheckbox.appendChild(partyText);             	
                	partyCheckboxes.appendChild(partyCheckbox);  
                	partyCheckboxes.appendChild(document.createElement("span"));            	               	
                }
            }


            
            function getSelectorText(s) {
                if (s.length < 60) {
                    return s;
                } else {
                    return s.substr(0,58) + "...";
                }
            }

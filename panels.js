var removing = false;

function addPanel() {
	// find largest leaf panel
	var panels = $("#" + currentTab + " .panel.panel-leaf");
	var largestPanel = panels[0];
	var largestArea = panels[0].clientWidth * panels[0].clientHeight;
	for (var i = 1; i < panels.length; i++) {
		p = panels[i];
		a = p.clientWidth * p.clientHeight;
		if (a  + 1000 >= largestArea) {	// if they're the same I want the last one for aesthetic reasons
			largestPanel = p;
			largestArea = a;
		}
	}

	// find largest panel id
	largestId = 0;
	for (var i = 0; i < panels.length; i++) {
		id = parseInt($(panels[i]).attr("id"));
		if (id > largestId) {
			largestId = id;
		}
	}

	// create a branch panel to replace it containing the old panel and the new one
	var $branchpanel = $(document.createElement("div")).addClass("panel");
	var $oldpanel = $(largestPanel);
	var $newpanel = $(document.createElement("div")).addClass("panel panel-leaf").attr("id", largestId + 1);

	if (largestPanel.clientWidth >= largestPanel.clientHeight * 1.25) { // *1.25 for better aspect ratio
		$branchpanel.addClass("panel-branch-horizontal");
	} else {
		$branchpanel.addClass("panel-branch-vertical");
	}

	$branchpanel.insertAfter($oldpanel);
	$oldpanel.detach().appendTo($branchpanel);
	$newpanel.appendTo($branchpanel);
}

function removePanel() {
	if (!removing) {
		removing = true;
		$(".panel.panel-leaf").mouseenter(function() {
			$panel = $(this);
			
			// Create covering element with same id as panel
			$cover = $(document.createElement("div")).addClass("remove-cover").attr("id", this.id);
			
			// Give it the same position
			$cover.css({
				top: this.offsetTop - 1,
				left: this.offsetLeft - 1,
				width: this.offsetWidth,
				height: this.offsetHeight,
			});
			
			// Get rid of the cover when mouse leaves the panel
			$cover.mouseleave(function () {
				$cover.remove();
			});
			
			// When clicked, remove cover, move the sibling panel up a level, remove the panel and branch panel
			$cover.click(function () {
				$cover.remove();
				$branchpanel = $panel.parent();
				$keeppanel = $panel.siblings();

				$keeppanel.insertAfter($branchpanel);
				$panel.remove();
				$branchpanel.remove();
			});

			// Put the cover in the place
			$cover.appendTo($(this.parentElement));
			$cover.show();
		});

		// Add class to show pointer cursor
		$(".panel.panel-leaf").addClass("panel-removable");

		// Make the remove button red
		$("#removepanel").addClass("active");
	} else {
		removing = false;
		$(".remove-cover").remove();
		$(".panel.panel-leaf").removeClass("panel-removable");
		$(".panel.panel-leaf").unbind("mouseenter");
		$("#removepanel").removeClass("active");
	}
}

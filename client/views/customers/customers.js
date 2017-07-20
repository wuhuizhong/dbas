var pageSession = new ReactiveDict();

Template.Customers.onCreated(function() {
	
});

Template.Customers.onDestroyed(function() {
	
});

Template.Customers.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.Customers.events({
	
});

Template.Customers.helpers({
	
});

var CustomersViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("CustomersViewSearchString");
	var sortBy = pageSession.get("CustomersViewSortBy");
	var sortAscending = pageSession.get("CustomersViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "phone", "email", "note", "totalAmount"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var CustomersViewExport = function(cursor, fileType) {
	var data = CustomersViewItems(cursor);
	var exportFields = ["name", "phone", "email", "note", "totalAmount"];

	var str = exportArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}

Template.CustomersView.onCreated(function() {
	
});

Template.CustomersView.onDestroyed(function() {
	
});

Template.CustomersView.onRendered(function() {
	pageSession.set("CustomersViewStyle", "table");
	
});

Template.CustomersView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("CustomersViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("CustomersViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("CustomersViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("customers.insert", mergeObjects(Router.currentRouteParams(), {}));
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		CustomersViewExport(this.customer_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		CustomersViewExport(this.customer_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		CustomersViewExport(this.customer_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		CustomersViewExport(this.customer_list, "json");
	}

	
});

Template.CustomersView.helpers({

	"insertButtonClass": function() {
		return Customers.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.customer_list || this.customer_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.customer_list && this.customer_list.count() > 0;
	},
	"isNotFound": function() {
		return this.customer_list && pageSession.get("CustomersViewSearchString") && CustomersViewItems(this.customer_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("CustomersViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("CustomersViewStyle") == "table";
	},
	"viewAsBlog": function() {
		return pageSession.get("CustomersViewStyle") == "blog";
	},
	"viewAsList": function() {
		return pageSession.get("CustomersViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("CustomersViewStyle") == "gallery";
	}

	
});


Template.CustomersViewTable.onCreated(function() {
	
});

Template.CustomersViewTable.onDestroyed(function() {
	
});

Template.CustomersViewTable.onRendered(function() {
	
});

Template.CustomersViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("CustomersViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("CustomersViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("CustomersViewSortAscending") || false;
			pageSession.set("CustomersViewSortAscending", !sortAscending);
		} else {
			pageSession.set("CustomersViewSortAscending", true);
		}
	}
});

Template.CustomersViewTable.helpers({
	"tableItems": function() {
		return CustomersViewItems(this.customer_list);
	}
});


Template.CustomersViewTableItems.onCreated(function() {
	
});

Template.CustomersViewTableItems.onDestroyed(function() {
	
});

Template.CustomersViewTableItems.onRendered(function() {
	
});

Template.CustomersViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("customers.details", mergeObjects(Router.currentRouteParams(), {customerId: this._id}));
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Meteor.call("customersUpdate", this._id, values, function(err, res) {
			if(err) {
				alert(err.message);
			}
		});

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Meteor.call("customersRemove", me._id, function(err, res) {
							if(err) {
								alert(err.message);
							}
						});
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("customers.edit", mergeObjects(Router.currentRouteParams(), {customerId: this._id}));
		return false;
	}
});

Template.CustomersViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Customers.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Customers.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

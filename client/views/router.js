Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

Router.publicRoutes = [
	"home_public",
	"login",
	"register",
	"forgot_password",
	"reset_password"
];

Router.privateRoutes = [
	"home_private",
	"customers",
	"customers.insert",
	"customers.details",
	"customers.edit",
	"invoices",
	"invoices.insert",
	"invoices.details",
	"invoices.details.items",
	"invoices.details.insert",
	"invoices.details.edit",
	"invoices.edit",
	"user_settings",
	"user_settings.profile",
	"user_settings.change_pass",
	"logout"
];

Router.freeRoutes = [
	
];

Router.roleMap = [
	
];

Router.defaultFreeRoute = "";
Router.defaultPublicRoute = "home_public";
Router.defaultPrivateRoute = "home_private";

Router.waitOn(function() { 
	Meteor.subscribe("current_user_data");
});

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		this.render('loading');
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.onBeforeAction(Router.ensureNotLogged, {only: Router.publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: Router.privateRoutes});
Router.onBeforeAction(Router.ensureGranted, {only: Router.freeRoutes}); // yes, route from free zone can be restricted to specific set of user roles

Router.map(function () {
	
	this.route("/", {name: "home_public", controller: "HomePublicController"});
	this.route("/login", {name: "login", controller: "LoginController"});
	this.route("/register", {name: "register", controller: "RegisterController"});
	this.route("/forgot_password", {name: "forgot_password", controller: "ForgotPasswordController"});
	this.route("/reset_password/:resetPasswordToken", {name: "reset_password", controller: "ResetPasswordController"});
	this.route("/home_private", {name: "home_private", controller: "HomePrivateController"});
	this.route("/customers", {name: "customers", controller: "CustomersController"});
	this.route("/customers/insert", {name: "customers.insert", controller: "CustomersInsertController"});
	this.route("/customers/details/:customerId", {name: "customers.details", controller: "CustomersDetailsController"});
	this.route("/customers/edit/:customerId", {name: "customers.edit", controller: "CustomersEditController"});
	this.route("/invoices", {name: "invoices", controller: "InvoicesController"});
	this.route("/invoices/insert", {name: "invoices.insert", controller: "InvoicesInsertController"});
	this.route("/invoices/details/:invoiceId", {name: "invoices.details", controller: "InvoicesDetailsController"});
	this.route("/invoices/details/:invoiceId/items", {name: "invoices.details.items", controller: "InvoicesDetailsItemsController"});
	this.route("/invoices/details/:invoiceId/insert", {name: "invoices.details.insert", controller: "InvoicesDetailsInsertController"});
	this.route("/invoices/details/:invoiceId/edit/:itemId", {name: "invoices.details.edit", controller: "InvoicesDetailsEditController"});
	this.route("/invoices/edit/:invoiceId", {name: "invoices.edit", controller: "InvoicesEditController"});
	this.route("/user_settings", {name: "user_settings", controller: "UserSettingsController"});
	this.route("/user_settings/profile", {name: "user_settings.profile", controller: "UserSettingsProfileController"});
	this.route("/user_settings/change_pass", {name: "user_settings.change_pass", controller: "UserSettingsChangePassController"});
	this.route("/logout", {name: "logout", controller: "LogoutController"});
});

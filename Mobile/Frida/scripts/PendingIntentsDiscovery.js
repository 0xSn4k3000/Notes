var pendingIntent = Java.use('android.app.PendingIntent');

var getActivity = pendingIntent.getActivity.overload("android.content.Context", "int", "android.content.Intent", "int");


console.log("\n==============================================================================");

getActivity.implementation = function(context, requestCode, intent, flags){
    console.log("[*] Context: " + context)
    console.log("[*] Calling PendingIntent.getActivity("+intent.getAction()+")");
    console.log("\t[-] Base Intent toString: " + intent.toString());
    console.log("\t[-] Base Intent getExtras: " + intent.getExtras());
    console.log("\t[-] Base Intent getFlags: " + intent.getFlags());
    console.log("==============================================================================");
    
    return this.getActivity(context, requestCode, intent, flags);
}

var getBroadcast = pendingIntent.getBroadcast.overload("android.content.Context", "int", "android.content.Intent", "int");

getBroadcast.implementation = function(context, requestCode, intent, flags){
    console.log("[*] Context: " + context)
    console.log("[*] Calling PendingIntent.getBroadcast("+intent.getAction()+")");
    console.log("\t[-] Base Intent toString: " + intent.toString());
    console.log("\t[-] Base Intent getExtras: " + intent.getExtras());
    console.log("\t[-] Base Intent getFlags: " + intent.getFlags());
    console.log("==============================================================================");
    
    return this.getBroadcast(context, requestCode, intent, flags);
}

var getService = pendingIntent.getService.overload("android.content.Context", "int", "android.content.Intent", "int");

getService.implementation = function(context, requestCode, intent, flags){
    console.log("[*] Context: " + context)
    console.log("[*] Calling PendingIntent.getService("+intent.getAction()+")");
    console.log("\t[-] Base Intent toString: " + intent.toString());
    console.log("\t[-] Base Intent getExtras: " + intent.getExtras());
    console.log("\t[-] Base Intent getFlags: " + intent.getFlags());
    console.log("==============================================================================");
    
    return this.getService(context, requestCode, intent, flags);
}

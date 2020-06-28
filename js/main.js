function set_circle_element(elm, value) {
                    value = value.toFixed(0);
                    if (value > 100) value = 100;

                    value2 = (360 / 100) * value;
                    // ---
                    /*
                    circle2
                    */
                    elm2 = elm + "_text";
                    let f4 = document.getElementById(elm2);
                    f4.textContent = value + "%";

                    let f3 = document.getElementById(elm);

                    if (value >= 0 && value <= 60)
                        f3.setAttribute('stroke', "#00bb00");

                    if (value >= 60 && value <= 75)
                        f3.setAttribute('stroke', "#ffaa00");

                    if (value >= 75)
                        f3.setAttribute('stroke', "#ff5555");

                    var buffer = "";

                    // 

                    var cx = 200;
                    var cy = 200;

                    //   buffer += "M "+cx+" "+cy+" ";
                    buffer += "";

                    var radius = 170;

                    var maxrad = value2;
                    for (var deg = 0; deg < maxrad; deg += 5) {
                        deg2 = -deg + 180;

                        var x = Math.sin(deg2 * Math.PI / 180) * radius;
                        var y = Math.cos(deg2 * Math.PI / 180) * radius;

                        if (deg == 0) {
                            buffer += "M " + (x + cx) + " " + (y + cy) + " ";

                        } else {
                            buffer += "L " + (x + cx) + " " + (y + cy) + " ";
                        }
                    }
                    // buffer += "L 240 300 ";
                    //  buffer += "L 240 350 ";
                    buffer += " ";

                    f3.setAttribute('d', buffer);

                } // set_circle_element

                var radius = 0;

                var radius_net = 0;

                function doitx(param) {
                    //alert("P: " + param);

                    if (param == 1) {
                        //   document.getElementById('kreis').cx = 230;

                        radius_net += 5;
                        set_circle_element("mynet", radius_net);

                    }

                    if (param == 2) {
                        //  let f1 = document.getElementById('kreis');
                        //f1.setAttribute('cx','210');

                        cpuvalue = document.getElementById('cpuvalue').value;

                        radius += 10.1;
                        // radius = 50;
                        set_circle_element("mycpu", radius);

                        // <circle id='kreis' cx="200" cy="200" r="40" stroke="#999999" stroke-width="1" fill="#ffffff" />

                        // ---
                    }

                }

               
                    var counter = 0;
                    var xtracounter = 0;
                    var initstatus = 0;
                    var automining = 0;
                    

 
                    /*
                    function doit()
                    {
                    xtracounter = 3;
                    alert("T2");
                    }
                    */

                    var autominer_cnt = 0;

                    function switch_autominer(val) {


                        // alert(val.checked);

                        if (val.checked) automining = 1;
                        else automining = 0;

                        //alert("automining:" + automining);

                    } // switch_autominer

                    function update_ticker() {
                        autominer_cnt++;

                        if (autominer_cnt == 11) autominer_cnt = 1;
                        //---
                        for (var i = 1; i <= 10; i++) {
                            var therect = 'rect' + i;
                            let f2 = document.getElementById(therect);
                            f2.setAttribute('fill', "#cccccc");

                        }

                        var therect = 'rect' + autominer_cnt;
                        let f3 = document.getElementById(therect);
                        f3.setAttribute('fill', "#000000");
                        //---        

                    } // update_ticker

                    function app_thread() {
                        counter++;

                        // show buttons 
                       

                        if (automining > 0) {

                            //  

                            //       dotransaction();
                            // ACTIVATE
                            dotransaction_bundle();
                        }

                        time = setTimeout('app_thread()', 3500);
                    }
                    // function app_thread()

                    // Mining Transaction BEGIN ------------------------
                    function dotransaction() {
                        
                        eosobject.transaction({
                            actions: [{
                                //                            account: 'eosio.token',
                                account: 'cpu2svxminer',
                                //                            account: 'sovsovsov223',
                                name: 'minebtc',
                                authorization: [{
                                    actor: scatter_account,
                                    permission: "active"
                                }],
                                data: {
                                    "user": scatter_account
                                }

                            }]
                        }).then(result => {
                            // If Success

                            console.log("Success!!!");

                            //alert('Success');

                            return;
                        }).catch(error => {
                            console.log("jsonerr: " + error);
                            // Error details

                            err = JSON.parse(error);
                            console.log("Error Transaction " + err);

                            //alert( 'Error:' + err.error.details[0].message );

                            
                            return;

                        });

                    } // function dotransaction() // function dotransaction()

                    // Mining Transaction END ------------------------

                    // Bundled Mining Transaction BEGIN ------------------------
                    function dotransaction_bundle() {

                        eosobject.getTableRows({
                            "json": "true",
                            "code": "eosiopowcoin",
                            "scope": "eosiopowcoin",
                            "table": "accounts"
                        }).then(function(value) {
                                //console.log("Table stat: ");
                                //console.log(value);

                                pow_mining_supply = value.rows[0].balance;
                                pow_mining_supply = parseFloat(pow_mining_supply);

                            } // value

                        );

                        var targetMiningRate = document.getElementById('target_mining_rate').value;
                        var btcMiningRate = document.getElementById('powMiningRate').textContent;
                            btcMiningRate = btcMiningRate.slice(31,41);
                            btcMiningRate = parseFloat(btcMiningRate).toFixed(8);                      

                        

                        var myRange = document.getElementById('myRange').value;
                        //alert("myRange: " + myRange);

                         var action = {

                            account: 'cpu2svxminer',
                            name: 'minebtc',
                            authorization: [{
                                actor: scatter_account,
                                permission: "active"
                            }],
                            data: {
                                "user": scatter_account
                            }
                        };


                        if (btcMiningRate >= targetMiningRate) {

                        console.log("============================");
                        console.log(action);

                        //var actions = [ action, action ]; 
                        var theactions = [];
                        for (var i = 0; i < myRange; i++) {
                            theactions[i] = action;
                        }
                        console.log(theactions);


                        eosobject.transaction({
                            actions: theactions
                        }).then(result => {
                            // If Success

                            console.log("Success!!!");

                            update_ticker();
                            return;

                        }).catch(error => {
                            console.log("jsonerr: " + error);
                            // Error details

                            err = JSON.parse(error);
                            console.log("Error Transaction " + err);
                            return;

                        });
                        return (0);

                    }} // function dotransaction()

                    // Transaction END ------------------------

                    // Initialize Ram for btc.ptokens token contract to be able to mine ------------------------
                    
                    // DoInit END ------------------------

                    function timeConverter(UNIX_timestamp) {
                        var a = new Date(UNIX_timestamp * 1000);
                        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        var year = a.getFullYear();
                        var month = months[a.getMonth()];
                        var date = a.getDate();
                        var hour = a.getHours();
                        var min = a.getMinutes();
                        var sec = a.getSeconds();
                        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
                        return time;
                    }

                    // Get Balance and CPU / Net etc... BEGIN ------------------------
                    function get_balance() {

                        if (scatter_account == undefined) return;
                        if (eosobject == null) return;

                        eosobject.getAccount(scatter_account).then(function(value) {

                                //console.log(value);
                                if (value == null)
                                    return;

                                var cpu_available = value.cpu_limit.available;

                                var cpu_max = value.cpu_limit.max;

                                var cpu_used = value.cpu_limit.used;

                                var net_max = value.net_limit.max;

                                var net_used = value.net_limit.used;

                                var balance = value.core_liquid_balance;

                                var balance1 = value.core_liquid_balance;

                                var cpu_proz = (cpu_used / cpu_max) * 100;
                                cpu_proz = Number(cpu_proz).toFixed(1);

                                var net_proz = (net_used / net_max) * 100;
                                net_proz = Number(net_proz).toFixed(1);

                                if (document.getElementById('balance')) {
                                    document.getElementById('balance').innerHTML = "" + balance;
                                }

                                if (document.getElementById('balance1')) {
                                    document.getElementById('balance1').innerHTML = "" + balance;
                                }

                                if (document.getElementById('mycpu')) {
                                    cpu_proz = Number(cpu_proz).toFixed(0) * 1;
                                    //  document.getElementById('div_cpu').innerHTML =  cpu_proz + "%";
                                    set_circle_element("mycpu", cpu_proz);
                                }

                                if (document.getElementById('mynet')) {
                                    net_proz = Number(net_proz).toFixed(0) * 1;

                                    // document.getElementById('div_net').innerHTML =  net_proz + "%";
                                    set_circle_element("mynet", net_proz);
                                }

                                //div_cpu div_net

                            } // function

                        );

                        /*
                        eos_balance pow_balance
                        */

                        eosobject.getTableRows({
                            "json": "true",
                            "code": "eosio.token",
                            "scope": scatter_account,
                            "table": "accounts"
                        }).then(function(value) {

                            var wert = value.rows.length;

                            try {
                                var last = value.rows[0].balance;
                                last = last.replace("EOS", "");

                                var unstaking = value.rows[0].unstaking;
                                var unstake_time = value.rows[0].unstake_time;

                                balance_token = last * 10000;

                                //document.getElementById('balance').innerHTML = "Your Balance: <span class='bold'>" + last + "</span>";
                                if (document.getElementById('eos_balance')) {
                                    document.getElementById('eos_balance').innerHTML = "<span class='bold'>" + last + " EOS</span>";
                                }                               


                            } catch (err) {


                            }


                        });
                     

                         eosobject.getTableRows({
                            "json": "true",
                            "code": "eosiopowcoin",
                            "scope": "eosiopowcoin",
                            "table": "accounts"
                        }).then(function(value) {
                                //console.log("Table stat: ");
                                //console.log(value);

                                pow_mining_supply = value.rows[0].balance;
                                pow_mining_supply = parseFloat(pow_mining_supply);

                            } // value

                        );

                        eosobject.getTableRows({
                            "json": "true",
                            "code": "sovdexrelays",
                            "scope": "PBTC",
                            "table": "powpair"
                        }).then(function(value) {
      
                            var powpbtcPrice = value.rows[0].price;
                                pobwptcPrice = parseFloat(powpbtcPrice).toFixed(8);


                         });

                        
                        eosobject.getTableRows({
                            "json": "true",
                            "code": "btc.ptokens",
                            "scope": scatter_account,
                            "table": "accounts"
                        }).then(function(value) {
                         

                            var wert = value.rows.length;
                            
                          

                            try {
                                var pbtcUserBalance = value.rows[0].balance;
                                pbtcUserBalance = parseFloat(pbtcUserBalance);
                                

                                var last = value.rows[0].balance;
                                last = last.replace("pBTC", "");


                                //         document.getElementById('debug').innerHTML = "+ " + last;     
                                initstatus = 1;

                                // Disable init-button
                                
                                document.getElementById('dotransaction_bundle').style.visibility = "visible";


                                    var mining_rate = (((pow_mining_supply / 40000)*pobwptcPrice)*31) - 0.00000001;
                                    mining_rate = parseFloat(mining_rate).toFixed(8);


                                    document.getElementById('powMiningRate').innerHTML = "<span class='bold' style='font-size:14px;'>Mining Reward per Transaction: <span style='color:#00bb00'>" + mining_rate + "</span> pBTC</span>";


                            } catch (err) {

                                initstatus = 0;
                                //                                      document.getElementById('debug').innerHTML = "ERROR " ;   

                                
                                
                                //   return Promise.reject(err);
                            }
                         
                            balance_token = last * 10000;
                            
                            //document.getElementById('balance').innerHTML = "Your Balance: <span class='bold'>" + last + "</span>";
                            if (document.getElementById('btc_balance')) {
                                document.getElementById('btc_balance').innerHTML = "<span class='bold'>" + last + "</span>";
                            }
                          
                        });

                    } // function getbalance()

                    // GetBalance END ------------------------

                    // GetBalance BEGIN ------------------------
                    function gettabledata() {
                        //tabledata

                        if (eosobject == null)
                            return;

                        eosobject.getTableRows({
                            "json": "true",
                            "code": "eosio.token",
                           

                            "scope": "EOS",
                            "table": "stat"
                        }).then(function(value) {
                                
                                eos_supply = value.rows[0].supply;

                                document.getElementById('tabledata').innerHTML = eos_supply;

                            } // value

                        );

                    } // function gettabledata()

                    // GetBalance END ------------------------

                    function change_node_click() {
                        var node = document.getElementById('scatter_host').value;

                           
                        scatter_host = node;

                        const network = ScatterJS.Network.fromJson({
                            blockchain: 'eos',
                            chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
                            host: scatter_host,
                            port: 443,
                            protocol: 'https'
                        });

                        ScatterJS.connect('Bitcoin Miner', {
                            network
                        }).then(connected => {
                            if (!connected)
                                return false;
                            scatter = ScatterJS.scatter;
                            scatterobj = scatter;

                            eosobject = scatter.eos(network, Eos);

                            scatter.addEventHandler((event, payload) => {
                                
                                //alert("Jau");
                            });
                        });

                    } // change_node_click()

             

                    ScatterJS.plugins(new ScatterEOS());

                    //var scatter_host = 'eos.greymass.com';
                    var scatter_host = 'api.main.alohaeos.com';
                    /*
                                const network = ScatterJS.Network.fromJson({
                                    blockchain: 'eos',
                                    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
                    //                host: 'nodes.get-scatter.com',
                                    host: 'eos.greymass.com',
                                    port: 443,
                                    protocol: 'https'
                                });
                    */
                    const network = ScatterJS.Network.fromJson({
                        blockchain: 'eos',
                        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
                        host: scatter_host,
                        port: 443,
                        protocol: 'https'
                    });

                    var eosobject = null;
                    var scatter_account = "";
                    var scatterobj;
                    var this_smartcontract = "";

                    function loginclick() {
                        if (scatter_account == "" || scatter_account == null) {

                            //      document.getElementById('spinnerdiv').style.visibility = "visible";
                            //    document.getElementById('buttontext').style.visibility = "hidden";
                            //document.getElementById('scatterhint').style.visibility = "hidden";

                            dologin();
                        } else {
                            //  document.getElementById('spinnerdiv').style.visibility = "visible";
                            //  document.getElementById('buttontext').style.visibility = "hidden";
                            // document.getElementById('scatterhint').style.visibility = "hidden";

                            dologout();
                        }

                    } // loginclick

                    window.dologin = async() => {

                        try {
                            console.log("dologin...");
                            await ScatterJS.login();
                            var eos = null;
                            setStatus();
                            setInterval(() => {
                                setStatus();
                            }, 1000);
                            if (scatterobj) {
                                eos = scatterobj.eos(network, Eos);
                                eosobj = eos;

                            }

                        } catch (err) {

                            //     document.getElementById('spinnerdiv').style.visibility = "hidden";
                            //    document.getElementById('buttontext').style.visibility = "visible";

                            //             document.getElementById('scatterhint').style.visibility = "visible";
                            return Promise.reject(err);
                        }

                    }

                    window.dologout = async() => {

                        try {
                            await scatter.forgetIdentity();
                            scatter_account = "";
                            console.log("Scatter logout2");
                            document.getElementById('accountname').innerHTML = "...";
                            //        document.getElementById('balance').innerHTML = "";
                            //    document.getElementById('balancesov').innerHTML = "";
                            //     document.getElementById('sov_liquid').innerHTML = "";
                            //     document.getElementById('sov_genesisinfo').innerHTML = "";

                            document.getElementById('buttontext').innerHTML = "Login ";
                            //        document.getElementById('scatterhint').style.visibility = "visible";
                        } catch (err) {

                            return Promise.reject(err);
                        }
                    }

                    // var scatter = null;
                    // var eos = null;

                    const setStatus = () => {

                        if (!scatter) {
                            return
                        }

                        // get accountname
                        const account = ScatterJS.account('eos');

                        if (account != undefined) {
                            scatter_account = account.name;

                            document.getElementById('buttontext').innerHTML = "Logout";

                            console.log(scatter_account + " is logged in");

                        } else {
                            scatter_account = "";

                            console.log("NO-ACCOUNT");
                            return
                        }

                        get_balance();

                        document.getElementById('accountname').innerHTML = "" + scatter_account;


                        document.getElementById('buttontext').style.visibility = "visible";

                    };
                    // setStatus()

                    ScatterJS.connect('Bitcoin Miner', {
                        network
                    }).then(connected => {
                        if (!connected)
                            return false;
                        scatter = ScatterJS.scatter;
                        scatterobj = scatter;
                        eosobject = scatter.eos(network, Eos);
                        scatter.addEventHandler((event, payload) => {
                        });
                    });

                    dologin();
                    app_thread();

                    // SCATTER END --------------------


                    function showVal(val) {


                        document.getElementById('dotransaction_bundle').innerHTML = "Mining Transactions X " + val;
                        
                    } 

                
                



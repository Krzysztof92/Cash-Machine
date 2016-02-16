//(function ()
//{
    // Function flags
    /*var exitStatus = 0, //0 - when in menu; 1 - when in submenu
        menuStatus = 0, //0 - when not logged in; 1 - when in menu, 2-when in submenu
        digitStatus = 0, //0 - when card not inserted; 1 - when typing PIN, 2-when typing amount of cash to deposit/withdraw
        allowDigitType = false, //false - turn off keyboard; true - turn on keyboard
        digitLength = 0,
        divLength = 0,
        maxDigitLength = 0,
        accountStatus = 1000,
        money = "";*/

    // Variables for function expressions
    var screenManipulation,
        screenTracker,
        interfaceHandler,
        keyboardHandler,
        slotsHandler,
        checkPin,
        submitKey,
        menuStatus = 0,// 0 - when NOT in menu yet, 1 - when in main-menu, 2 - when in sub-menu
        screensArr = [],
        checkAccountStatus,
        depositMoney,
        withdrawMoney,
        actionListener,
        digitListener,
        blockCard,
        exit,
        customer;

    //Changes menus screen depend of which one is chosen
    screenManipulation = function(scrName)
    {
        var screenName = scrName;
        console.log('Current screenName: ', screenName);

        for (var i = 0, el = document.getElementById('screen').childNodes,len = el.length; i < len; i++)
        {
            if (el[i].nodeType === 1 && el[i].style.display !== 'none')
                console.log('Visible: ', el[i]);
        }

        switch (screenName)
        {
            case 'depositButton': depositMoney();
                            break;
            case 'withdrawButton': withdrawMoney();
                            break;
            case 'checkAccountButton': document.getElementById('main-options').style.display = 'none';
                                    var statusMenu = document.getElementById('status-menu');
                                    statusMenu.style.display = 'block';
                                    var moneyStatus = statusMenu.getElementsByClassName('top')[0];
                                    moneyStatus.style.display = 'block';

                                    checkAccountStatus(moneyStatus);
                            break;
            case 'cardInserted': document.getElementById('pin').style.display = 'block';
                                document.getElementById('pin').getElementsByClassName('hints')[0].style.display = 'block';
                                //checkPin();
                            break;
            case 'wrongPin': document.getElementById('pin').getElementsByClassName('hints')[0].style.display = 'none';
                            document.getElementById('pin').getElementsByClassName('hints')[1].style.display = 'block';
                            break;
            case 'blocked': document.getElementById('pin').getElementsByClassName('hints')[1].style.display = 'none';
                            document.getElementById('pin').getElementsByClassName('hints')[2].style.display = 'block';
                            blockCard();
                            break;
            case 'main-options': document.getElementById('main-options').style.display = 'flex';
                            var mainOpts = document.getElementById('main-options').getElementsByClassName('hints');
                            for (var i = 0; i < mainOpts.length; i++)
                            {
                                mainOpts[i].style.display = 'inline-block';
                            }
                            break;
            case 'exitButton': exit();
                            break;
            default: console.log('Default switch... what to do?');
                            break;
        }

    };

    //Invokes every time some button in interface is pressed
    interfaceHandler = function(ev)
    {
        if (ev.target.tagName.toUpperCase() !== 'INPUT' && ev.target.tagName.toUpperCase() !== 'P' && ev.target.tagName.toUpperCase() !== 'DIV')
        {
            console.log('\n Interface handler ev.target: ', ev.target.id, '|| ', ev.target.tagName);
            screenManipulation(ev.target.id);
        }
    };

    //Invokes every time some keyboard button is pressed
/*    keyboardHandler = function(ev, digitS, minimumPinLen, pinInput)
    {
        //console.log('Keyboard handler ev.target: ', ev.target.innerHTML);
        ////console.log('[F]keyboardHandler?');
        ////////////

        console.log('pinInput val: ', pinInput.value, '|| pinInputLen: ', pinInput.value.length);



        //if (ev.target.tagName.toUpperCase() !== 'DIV' && digitS === 1 && Number(ev.target.innerHTML) >= 0)
        {


            //pinInputVal += ev.target.innerHTML;
            //console.log('pinInput: ', pinInputVal);
            //console.log('minimumPinLen: ', minimumPinLen,'|| pinLen: ', pinLen);
        }
    };*/

    //Invokes when card is inserted (at the beginning)
    slotsHandler = function(ev, intervalId, iC, s, cS, slotListen)
    {
        if (ev.target.id === 'cardSlot' && slotListen === true)
        {
            console.log('Slots handler ev.target: ', ev.target.innerHTML);
            console.log('listener? ',slotListen);
            console.log('intervalId: ', intervalId);
            clearInterval(intervalId);

            iC.style.display = 'none';
            cS.style.background = 'blue';
            cS.style.color = 'white';

            screenManipulation('cardInserted');
        }
    };

    //After card button is pressed
    checkPin = function(ev, pinInput, correctPin, pinCount, maxPinCount, failCount)
    {
        ////console.log('[F]checkPin?');
        ////console.log('pinInput val: ', pinInput.value, '/ pinInputLen: ', pinInput.value.length, 'correctPin: ', correctPin);

        //pinCount++;

        if (Number(pinInput.value) === correctPin)
        {
            console.log('PIN is correct!');
            accountMenu();
            return 1;
        }

        else if (pinCount < 3)
        {
            console.log('PIN is wrong! counter', pinCount);
            screenManipulation('wrongPin');

            document.getElementsByClassName('typeDigits')[1].value = '';

            if (failCount.textContent.length >= 18)
            {
                console.log('???');
                failCount.textContent = failCount.textContent.slice(0, -1);
            }

            failCount.textContent += maxPinCount - pinCount;
            console.log('failCount: ', failCount);

            return 2;
        }

        else
        {
            console.log('Your card is blocked!');

            screenManipulation('blocked');

            return 2;
        }


        //onScreen.innerHTML = "Wpisz kod PIN: ";

    /*  var onScreen = document.getElementById('screen');
        divLength = onScreen.innerHTML.length;
        digitLength = 0;
        maxDigitLength = 4;
        digitStatus = 1;
        allowDigitType = true;*/
    };

    blockCard = function()
    {
        var blink = 0;

        setInterval(function()
        {
            if (document.getElementById('cardSlot').style.background !== 'red')
            {
                document.getElementById('cardSlot').style.background = 'red';
                document.getElementById('cardSlot').style.color = 'white';
            }
            else
            {
                document.getElementById('cardSlot').style.background = 'white';
                document.getElementById('cardSlot').style.color = 'red';
            }

            blink++;
        }, 500);

        setTimeout(function()
        {
            location.reload(true);
        }, 4500);

    };

    // Main menu after PIN is accepted
    accountMenu = function()
    {
        console.log('[F] (main) accountMenu?');

        menuStatus = 1;

        document.getElementById('start').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
        document.getElementsByClassName('top')[1].style.display = 'block';
        setTimeout(function()
        {
            document.getElementsByClassName('top')[1].style.display = 'none';
            screenManipulation('main-options');
        }, 2000);

        /*exitStatus = 0;
        menuStatus = 1;
        allowDigitType = false;
        digitLength = 0;*/

    };

    checkAccountStatus = function(currentMoney)
    {
        console.log('[F]checkAccountStatus?');

        menuStatus = 2;

        var currentMoneyStatus = customer.getCustomerAccountStatus(),
            currency = ' PLN';
        console.log('Current money: ', currentMoneyStatus);
        currentMoney.innerHTML += ' ' + currentMoneyStatus + currency;

        //  console.log("accountStatus "+accountStatus);
       // onScreen.innerHTML = "Twój stan konta wynosi: " + accountStatus + "PLN";

        /*console.log('checkAccountStatus callback? ', callback);
        if (typeof callback === 'function') callback();*/
    };


    depositMoney = function()
    {
        console.log('[F]depositMoney?');

        exitStatus = 1;
        menuStatus = 2;
        digitStatus = 2;
        allowDigitType = true;
        //// onScreen.innerHTML = "Kwota do wpłaty: ";
        divLength = onScreen.innerHTML.length;
        //var maxDigitLength = maxDigitLength;
        // amount = onScreen.innerHTML.slice(divLength, maxDigitLength);

        money = "up";
        //  console.log("maxDigitLength " + maxDigitLength);
    };

    withdrawMoney = function()
    {
        console.log('[F]withdrawMoney?');

        exitStatus = 1;
        menuStatus = 2;
        digitStatus = 2;
        allowDigitType = true;
        //// onScreen.innerHTML = "Kwota do wypłaty: ";
        divLength = onScreen.innerHTML.length;
        // var maxDigitLength = maxDigitLength;
        //amount = onScreen.innerHTML.slice(divLength, maxDigitLength);
        //accountStatus -= amount;
        money = "down";
        //  console.log("maxDigitLength " + maxDigitLength);
    };


    // When "wyjdź" is pressed
    exit = function()
    {
        console.log('[F]exit?');

        //////////////////////
        switch (menuStatus)
        {
            case 0: location.reload(true);
                break;
            case 2: screenManipulation();
                    accountMenu();
                break;
        }
    };

    customer = {

        number : 0,
        name : 'Gość',
        pin : 1234,
        money : 12000,

        loadDefaults : function()
        {
            ////console.log('localStorage STATUS: ', localStorage, ' len ', localStorage.length);
            if (!localStorage.getItem('0') || localStorage.length === 0)
            {
                console.log('Beginning localStorage: ', localStorage);

                localStorage.setItem(customer.number.toString(), JSON.stringify({
                    name : customer.name,
                    pin : customer.pin,
                    money : customer.money
                }));

                alert('Nie znaleziono żadnego użytkownika! Dlatego utworzono konto gościa.' + this.showAccounts());

                console.log('Created guest user in localStorage: ', localStorage);
            }

            else if (localStorage.getItem('0') && localStorage.length === 1)
            {
                alert('Konto gościa jest aktywne. Zaloguj się na nie lub utwórz swoje konto.' + this.showAccounts());
            }

            else if (localStorage.length > 1)
            {
                var availableAccounts = this.showAccounts('no');

                ////alert(availableAccounts);
            }
        },

        showAccounts : function(newLine)
        {

            var cpArr = [], cpObj = {},
                str = '\n\nDostępne konta:';

            if (newLine === 'no') str = str.slice(2);
            str += '\n       | Nazwa  |  PIN  |  Budżet |\n        ';

            for (var outer in localStorage)
            {
                if (localStorage.hasOwnProperty(outer))
                {
                    var lS = JSON.parse(localStorage[outer]);
                    //console.log('OUTER: ', lS);
                    for (var inner in lS)
                    {

                        ////console.log('INNER: ',inner, ' ', lS[inner]);
                        cpObj[inner] = lS[inner];
                        //console.log('cpObj: ', cpObj);
                        str += ' ' + lS[inner] + ' | ';

                        if (inner == 'name')
                        {
                            str = str.slice(0, str.length-2) + '   |';
                        }
                        else if (inner == 'money')
                        {
                            str = str.slice(0, str.length-2) + '\n        ';
                        }
                    }
                    cpArr.push(cpObj);
                    cpObj = {};
                }
            }
            //console.log('cpArr: ', cpArr);
            return str;
        },

        getCustomerName : function()
        {
            return this.name;
        },

        getCustomerPinCode : function()
        {
            return this.pin;
        },

        getCustomerAccountStatus : function()
        {
            return this.money;
        }

    };

    (function()
    {
        customer.loadDefaults();
    }());

    /*(function()
    {
        if (!localStorage.getItem('0'))
        {
            console.log('NOPE default localStorage item');
            localStorage.setItem('0', JSON.stringify({ name : 'Default Name', money : 12000 }) );
        }
        else
        {
            console.log('Yep, localStorage has default values');
        }
    }());*/

    var customerName = customer.getCustomerName(),
        customerPin = customer.getCustomerPinCode(),
        customerMoney = customer.getCustomerAccountStatus();
    console.log('Default customer: ', customerName, ' ', customerPin, ' ', customerMoney);

    //function Customer(name, ownPin)
    //{
    //    var ownerName = name,
    //        ownerPin = ownPin;
    //
    //    this.getOwnerName = function()
    //    {
    //        console.log('Owner name is: ', ownerName);
    //    };
    //
    //    /*this.getOwnerPinCode = function()
    //    {
    //        return ownerPin;
    //    }*/
    //}
    //
    //Customer.prototype.getOwnerPinCode = function()
    //{
    //    return this.ownerPin;
    //};
    //
    //var owner = new Customer('tester', 1234);
    //owner.getOwnerName();

    // Site start
    function start()
    {
        /*var startScr = document.getElementById(''),
            mainMenus = document.getElementsByClassName('main-menus'),
            subMenus = document.getElementsByClassName('sub-menus');*/
        var iC = document.getElementById('insertCard'),
            s = document.getElementById('start'),
            cS = document.getElementById('cardSlot');

        iC.style.display = 'block';

        s.style.display = 'block';

        cS.style.color = 'green';
        cS.style.background = 'white';

        var intervalId = 0;
        intervalId = setInterval(function()
        {
            if (cS.style.color === 'green')
            {
                cS.style.color = 'white';
                cS.style.background = 'green';
            }

            else
            {
                cS.style.color = 'green';
                cS.style.background = 'white';
            }

        }, 1000);

        //// onScreen = document.getElementById('screen');
        ////onScreen.innerHTML = "Włoż kartę do czytnika &nbsp; (kliknij /card/)";
        // console.log("inner length " + onScreen.innerHTML.length);
        ////pinCount = 0;

        var correctPin = 1234; //Number(owner.getOwnerPinCode());

        function eventsHandling(d)
        {
            var slotListening = true,
                digitStatus = 0,//0 - when started, 1 - when typing PIN, 2 - when Deposit or Withdraw
                minimumPinLen = 4,
                canCheckPin = false,
                pinCount = 0,
                maxPinCount = 3,
                failCount = document.getElementById('wrongPin').childNodes[5];

            d.getElementById('interface').addEventListener('click', interfaceHandler, false);
            d.getElementById('keyboard').addEventListener('click', function(ev)
            {
                ////console.log('EV!: ', ev.target.innerHTML);
                var pinInput = d.getElementsByClassName('typeDigits')[digitStatus - 1];

                //console.log('?pinCount: ', pinCount);

                if (ev.target.tagName.toUpperCase() !== 'DIV' && digitStatus > 0 && Number(ev.target.innerHTML) >= 0)
                {

                    pinInput.value += ev.target.innerHTML;
                    //console.log('pinInput: ', pinInput.value, '|| pressed: ', ev.target.innerHTML);

                    if (pinInput.value.length >= minimumPinLen)
                    {
                        //canCheckPin = keyboardHandler(ev, digitStatus, minimumPinLen, pinInput);
                        //canCheckPin = checkPin(ev, minimumPinLen, pinInput);

                        canCheckPin = true;
                    }

                }

                else if (ev.target.innerHTML === 'Del' && digitStatus > 0)
                {
                    //console.log('del');
                    if (pinInput.value.length)
                    {
                        //console.log('delete...', pinInput.value[pinInput.value.length-1]);
                        pinInput.value = pinInput.value.slice(0, -1);


                        if (pinInput.value.length < minimumPinLen)
                        {
                            canCheckPin = false;
                        }
                    }
                }

                else if (canCheckPin === true)
                {
                    if (ev.target.innerHTML === 'OK')
                    {
                        pinCount++;
                        //console.log('If >= 4 i can check: ', pinInput.value.length);
                        digitStatus = checkPin(ev, pinInput, correctPin, pinCount, maxPinCount, failCount);
                        console.log('[R]digitStatus?: ', digitStatus);
                    }
                }
            }, false);
            d.getElementById('slots').addEventListener('click', function(ev)
            {
                slotsHandler(ev, intervalId, iC, s, cS, slotListening);
                slotListening = false;
                digitStatus = 1;
            }, false);


        }
        eventsHandling(document);

    }
    start();
//}());
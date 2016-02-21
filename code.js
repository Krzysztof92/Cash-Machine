//(function ()
//{

    // Variables for function expressions
    var originPath = location.href,
        screensObj,
        screenManipulation,
        screenTracker,
        showOrHide,
        interfaceHandler,
        keyboardHandler,
        slotsHandler,
        checkPin,
        submitKey,
        menuStatus = 0,// 0 - when NOT in menu yet, 1 - when typing PIN, 2 - when in main-menu, 3 - when in sub-menu
        screensArr = [],
        accountMenu,
        checkAccountStatus,
        depositMoney,
        withdrawMoney,
        actionListener,
        digitListener,
        blockCard,
        exit,
        customer;

    screensObj = {

        start : 'insertCard',
        pin : 'pin',
        access: 'welcome',
        accountMenu : 'main-options',
        depositMenu : 'deposit-menu',
        statusMenu : 'status-menu',
        withdrawMenu : 'withdraw-menu',
        settingsMenu: 'settings-menu',
        exit : 'see-you',

        moveTo : function(id)
        {
            console.log('go to? : ', this[id]);
            location.href = originPath + '#' + this[id];
        }
    };


    //Changes menus screen depend of which one is chosen
    screenManipulation = function(scrName)
    {
        var screenName = scrName;
        console.log('Current screenName: ', screenName);

        for (var i = 0, el = document.getElementById('screen').childNodes,len = el.length; i < len; i++)
        {
            if (el[i].nodeType === 1 && el[i].style.display !== 'none')
                ;////console.log('Visible: ', el[i]);
        }

        switch (screenName)
        {
            case 'depositButton': depositMoney();
                            break;
            case 'withdrawButton': withdrawMoney();
                            break;
            case 'checkAccountButton':

                                    /*console.log('//// WTF?: ', [
                                        document.getElementById('main-options').classList,
                                        document.getElementById('status-menu').classList,
                                        document.getElementById('status-menu').getElementsByClassName('top')[0].classList
                                    ]);*/

                                    //showOrHide(document.getElementById('main-menu').getElementsByClassName('top')[0]);

                                    screensObj.moveTo('statusMenu');

                                    /*showOrHide(document.getElementById('main-options')); //.style.display = 'none';
                                    var statusMenu = document.getElementById('status-menu');
                                    showOrHide(statusMenu); //.style.display = 'block';
                                    var moneyStatus = statusMenu.getElementsByClassName('top')[0];
                                    showOrHide(moneyStatus); //.style.display = 'block';*/

                                    checkAccountStatus();
                            break;
            case 'cardInserted': ////showOrHide(document.getElementById('pin')); //.style.display = 'block';
                            ////showOrHide(document.getElementById('pin').getElementsByClassName('hints')[0]); //.style.display = 'block';
                            screensObj.moveTo('pin');

                                //checkPin();
                            break;
            case 'wrongPin': showOrHide(document.getElementById('pin').getElementsByClassName('hints')[0]); //.style.display = 'none';
                            showOrHide(document.getElementById('pin').getElementsByClassName('hints')[1]); //.style.display = 'block';
                            break;
            case 'blocked': showOrHide(document.getElementById('pin').getElementsByClassName('hints')[1]); //.style.display = 'none';
                            showOrHide(document.getElementById('pin').getElementsByClassName('hints')[2]); //.style.display = 'block';
                            blockCard();
                            break;
            case 'main-options':
                            screensObj.moveTo('accountMenu');
                            /*showOrHide(document.getElementById('main-options'), 'rwd'); //.style.display = 'flex';
                            var mainOpts = document.getElementById('main-options').getElementsByClassName('hints');
                            for (var i = 0; i < mainOpts.length; i++)
                            {
                                showOrHide(mainOpts[i], 'multi'); //.style.display = 'inline-block';
                            }*/
                            break;
            case 'exitButton': exit();
                            break;
            default: console.log('Default switch... what to do?');
                            break;
        }

    };

    showOrHide = function(elem, type)
    {
        console.log('/***/ is hidden? ', elem.classList.contains('hide'));


        function hide()
        {
            var removeIt = elem.classList[1];

            console.log('???Hide?? ', elem.classList, ' || ', JSON.stringify(removeIt));

            elem.classList.remove(removeIt);

            if (elem.hasChildNodes())
            {
                for (var node in elem.childNodes)
                {
                    if (elem.childNodes.hasOwnProperty(node))
                    {
                        if (elem.childNodes[node].nodeType === 1)
                        {
                            console.log('~~Node: ', node, ' <> ', elem.childNodes[node].classList[1]);
                            removeIt = elem.childNodes[node].classList[1];
                            elem.childNodes[node].classList.remove(removeIt);
                            elem.childNodes[node].classList.add('hide');
                        }
                    }
                }
            }

            console.log('~~~~removed visibility? ', elem.classList);
            elem.classList.add('hide');
            console.log('--- I hid it! >', elem, ' >>> ', elem.classList);
        }

        function show()
        {
            var visible = type === 'multi' ? 'showMultiLine' : type === 'rwd' ? 'showFlex' : 'showSingleLine';

            ////console.log('!!!Show?? ', elem.classList);
            elem.classList.remove('hide');
            elem.classList.add(visible);
            ////console.log('=== I showed it! >', elem.innerHTML, ' >>> ', elem.classList);
        }

        if (Array.isArray(elem))
        {
            elem.forEach(function()
            {
                elem.classList.contains('hide') ? show() : hide();
                /*if (elem.classList.contains('hide')) show();
                else hide();*/
            });
        }
        else elem.classList.contains('hide') ? show() : hide();
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


    //Invokes when card is inserted (at the beginning)
    slotsHandler = function(ev, intervalId, iC, s, cS, slotListen)
    {
        if (ev.target.id === 'cardSlot' && slotListen === true)
        {
            menuStatus = 1;

            console.log('Slots handler ev.target: ', ev.target.innerHTML);
            ////console.log('listener? ',slotListen);
            ////console.log('intervalId: ', intervalId);
            clearInterval(intervalId);

            //showOrHide(iC); //.style.display = 'none';
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

        if (Number(pinInput.value) === correctPin)
        {
            console.log('PIN is correct!');
            accountMenu(true);
            return 1;
        }

        else if (pinCount < 3)
        {
            console.log('PIN is wrong! counter', pinCount);

            if (pinCount === 1) screenManipulation('wrongPin');

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

    };

    blockCard = function()
    {
        var blink = 0;
        menuStatus = 0;

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
            window.open (originPath,'_self',false);
            /*location.href = originPath;
            location.reload(true);*/
        }, 4500);

    };

    // Main menu after PIN is accepted
    accountMenu = function(entry)
    {
        console.log('[F] (main) accountMenu?');

        menuStatus = 2;

        if (!entry) screenManipulation('main-options');


        /*showOrHide(document.getElementById('start')); //.style.display = 'none';
        showOrHide(document.getElementById('main-menu')); //.style.display = 'block';
        showOrHide(document.getElementsByClassName('top')[1]); //.style.display = 'block';*/

        else
        {
            screensObj.moveTo('access');

            setTimeout(function ()
            {
                //showOrHide(document.getElementsByClassName('top')[1]); //.style.display = 'none';
                screenManipulation('main-options');
            }, 2000);
        }

    };

    checkAccountStatus = function()
    {
        console.log('[F]checkAccountStatus?');

        menuStatus = 3;

        var currentMoney = document.getElementById('status-menu').getElementsByClassName('top')[0],
            currentMoneyStatus = customer.getCustomerAccountStatus(),
            currency = ' PLN';
        console.log('Current money: ', currentMoneyStatus);
        if (currentMoney.innerHTML.indexOf(currentMoneyStatus) < 0)
                currentMoney.innerHTML += ' ' + currentMoneyStatus + currency;
        ////console.log('Current money InnerHTML: ', currentMoney.innerHTML);

    };


    depositMoney = function()
    {
        console.log('[F]depositMoney?');

        menuStatus = 3;

    };

    withdrawMoney = function()
    {
        console.log('[F]withdrawMoney?');

        menuStatus = 3;

    };


    // When "wyjdź" is pressed
    exit = function()
    {
        console.log('[F]exit?');

        //////////////////////
        if (menuStatus === 1 || menuStatus === 2)
        {
            var c = confirm ('Czy na pewno chcesz wyjść z bankomatu?');
            if (c) window.open (originPath, '_self', false);
            //location.reload(true);
        }
        else if (menuStatus === 3)
        {
           accountMenu();
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


    var customerName = customer.getCustomerName(),
        customerPin = customer.getCustomerPinCode(),
        customerMoney = customer.getCustomerAccountStatus();
    console.log('Default customer: ', customerName, ' ', customerPin, ' ', customerMoney);


    // Site start
    function start()
    {
        console.log('Origin path: ', originPath);

        var iC = document.getElementById('insertCard'),
            s = document.getElementById('start'),
            cS = document.getElementById('cardSlot');

        /*iC.style.display = 'block';

        s.style.display = 'block';*/

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

        var correctPin = 1234; ////Number(owner.getOwnerPinCode());

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
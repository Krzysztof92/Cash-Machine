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
        resetAllData,
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
            ////console.log('go to? : ', this[id]);
            location.href = originPath + '#' + this[id];
        },

        getProperties : function(id)
        {

            for (var prop in this)
            //Object.keys(this).forEach(function(i, prop)
            {
                if (this.hasOwnProperty(prop))
                {

                    if (id === this[prop])
                    {
                        ////console.log('Props? ', id, ' || ', this[prop]); //Object.keys(this), ' i ', i);
                        return this[prop];
                    }
                    //else console.log('id/this[prop]: ', id, ' / ', this[prop]);
                }
            }

        }
    };


    //Changes menus screen depend of which one is chosen
    screenManipulation = function(scrName)
    {
        var screenName = scrName;
        ////console.log('Current screenName: ', screenName);

        for (var i = 0, el = document.getElementById('screen').childNodes,len = el.length; i < len; i++)
        {
            if (el[i].nodeType === 1 && el[i].style.display !== 'none')
                ;////console.log('Visible: ', el[i]);
        }

        switch (screenName)
        {
            case 'depositButton':  screensObj.moveTo('depositMenu');
                            depositMoney();
                            break;
            case 'withdrawButton':  screensObj.moveTo('withdrawMenu');
                            withdrawMoney();
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
            if ((menuStatus > 0 && ev.target.id === 'exitButton') || (menuStatus === 2 && ev.target.id !== 'exitButton'))
            {
                console.log('\n Interface handler ev.target: ', ev.target.id, '|| ', ev.target.tagName);
                screenManipulation(ev.target.id);
            }
        }
    };


    //Invokes when card is inserted (at the beginning)
    slotsHandler = function(ev, intervalId, iC, s, cS, slotListen)
    {
        if (ev.target.id === 'cardSlot' && slotListen === true)
        {
            menuStatus = 1;

            ////console.log('Slots handler ev.target: ', ev.target.innerHTML);
            //console.log('listener? ',slotListen);
            //console.log('intervalId: ', intervalId);
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
            ////console.log('PIN is correct!');
            accountMenu(true);
            return 1;
        }

        else if (pinCount < 3)
        {
            ////console.log('PIN is wrong! counter', pinCount);

            if (pinCount === 1) screenManipulation('wrongPin');

            document.getElementsByClassName('typeDigits')[1].value = '';

            if (failCount.textContent.length >= 18)
            {
                //console.log('???');
                failCount.textContent = failCount.textContent.slice(0, -1);
            }

            failCount.textContent += maxPinCount - pinCount;
            //console.log('failCount: ', failCount);

            return 2;
        }

        else
        {
            ////console.log('Your card is blocked!');

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
        ////console.log('[F] (main) accountMenu?');

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
        ////console.log('[F]checkAccountStatus?');

        menuStatus = 3;

        var currentMoney = document.getElementById('status-menu').getElementsByClassName('top')[0],
            currentMoneyStatus = customer.getCustomerAccountStatus(),
            currency = ' PLN';

        console.log('Current money: ', currentMoneyStatus);

        ////console.log('Current money InnerHTML: ', JSON.stringify(currentMoney.innerHTML), ' len: ', currentMoney.innerHTML.length);

        /*if (currentMoney.innerHTML.indexOf(currentMoneyStatus) < 0)
                currentMoney.innerHTML = currentMoney.innerHTML.slice(0, 26) + ' ' + currentMoneyStatus + currency;*/

        currentMoney.querySelector('[title]').value = currentMoneyStatus + currency;

    };


    depositMoney = function()
    {
        ////console.log('[F]depositMoney?');



        menuStatus = 3;

    };

    withdrawMoney = function()
    {
        ////console.log('[F]withdrawMoney?');

        menuStatus = 3;

    };


    // When "wyjdź" is pressed
    exit = function()
    {
        ////console.log('[F]exit?');

        //////////////////////
        if (menuStatus === 1 || menuStatus === 2)
        {
            var c = confirm ('Czy na pewno chcesz wyjść z bankomatu?');
            if (c)
            {
                ////customer.saveCustomerMoney();
                customer.storeCustomerData();
                setTimeout(function()
                {
                    window.open(originPath, '_self', false);
                }, 3000);
            }
            //location.reload(true);
        }
        else if (menuStatus === 3)
        {
            ////console.log('Leaving menu: ', location.href, ' > ', location.href.slice(location.href.indexOf('#')+1));
            //var leavingMenu = location.href.slice(location.href.indexOf('#')+1);
            //if (leavingMenu !== 'status-menu')
            //{
                var clearIt = checkElementInClass(); //'buttonRi', location.href.slice(location.href.indexOf('#') + 1));
                ////console.log('clearIt?: ', clearIt);
                clearIt.value = '';
            //}

            accountMenu();
        }
    };


    // removes all data in localStorage, so then Guest Account with default data will be created
    resetAllData = function()
    {
        var reset = confirm('Czy na pewno chcesz usunąć wszystkie konta użytkowników? Zostanie wtedy utworzone konto Gość z domyślnymi danymi.');

        if (reset)
        {
            localStorage.clear();
            window.open(originPath, '_self', false);
        }
    };

    customer = {

        number : '', //0,
        name : '', //'Gość',
        pin : '', //1234,
        money : '', //12000,

        loadAccount : function()
        {
            ////console.log('localStorage STATUS: ', localStorage, ' len ', localStorage.length);
            if (!localStorage.getItem('0') || localStorage.length === 0)
            {
                console.log('Beginning localStorage: \n', localStorage, ' \nempty Customer: ', this);

                localStorage.setItem('0', JSON.stringify({
                    name : 'Gość', //customer.name,
                    pin : 1234, //customer.pin,
                    money : 12000 //customer.money
                }));

                alert('Nie znaleziono żadnego użytkownika! Dlatego utworzono konto gościa.' + this.showAccountList());

                this.setCustomerProperties();

                console.log('Created guest user in localStorage: ', localStorage, ' ready Guest Customer: ', this);

            }

            else if (localStorage.getItem('0') && localStorage.length === 1)
            {
                alert('Konto gościa jest aktywne. Zaloguj się na nie lub utwórz swoje konto.' + this.showAccountList());

                this.setCustomerProperties();

            }

            else if (localStorage.length > 1)
            {
                var availableAccounts = this.showAccountList('no');

                //alert(availableAccounts);
            }

            /*for (var prop in this)
            {
                if (this.hasOwnProperty(prop))
                {
                    console.log('????: ', prop, ' / ', this, ' / ', this[prop]);
                }
            }*/

            ////
            /*var c = this.getCustomerProperties();
            console.log('C ', c);*/
            ////

        },

        showAccountList : function(newLine)
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
                        if (lS.hasOwnProperty(inner))
                        {
                            ////console.log('INNER: ',inner, ' ', lS[inner]);
                            cpObj[inner] = lS[inner];
                            //console.log('cpObj: ', cpObj);
                            str += ' ' + lS[inner] + ' | ';

                            if (inner == 'name')
                            {
                                str = str.slice(0, str.length - 2) + '   |';
                            }
                            else if (inner == 'money')
                            {
                                str = str.slice(0, str.length - 2) + '\n        ';
                            }
                        }
                    }
                    cpArr.push(cpObj);
                    cpObj = {};
                }
            }
            //console.log('cpArr: ', cpArr);
            return str;
        },

        getCustomerNumber : function()
        {
            return this.number;
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
            // this.saveCustomerMoney();
            //this.getCustomerMethods();
            // this.money = JSON.parse(localStorage.getItem(this.number.toString())).money = ;
            return this.money;
        },

        withdrawCustomerMoney : function(payOut)
        {
            if (this.money - payOut < 0)
            {
                alert('Nie masz tyle pieniędzy!');
                return false;
            }
            else
            {
                this.money -= Number(payOut);
                return true;
            }
        },

        depositCustomerMoney : function(payIn)
        {

            this.money += Number(payIn);
            console.log('Money type: >', typeof this.money, '< payIn ', typeof payIn);

            return true;
        },


        // makes an Object of Customer properties (for localStorage usage)
        getCustomerProperties : function(includeNumber)
        {
            var obj = {};

            for(var prop in this)
            {
                if (this.hasOwnProperty(prop))
                {

                    if(typeof this[prop] !== "function") // && prop != 'number')
                    {
                        obj[prop] = this[prop]
                    }
                }
            }
            if (includeNumber)
                obj.number = this.number;

            ////console.log('>>From getCustomerProperties: ', obj);
            return obj;
        },

        //// why/when to use??
        setCustomerProperties : function(customerNumber)
        {
            ////console.log('\nBefore filling customer object from LS: ', this, ' LS: ', localStorage);

            var num = customerNumber || (localStorage.length - 1).toString(); //,
                /*obj = JSON.parse(localStorage.getItem(num));
            obj.number = Number(num);*/


            /*for (var prop in localStorage)
            {
                if (localStorage.hasOwnProperty(prop))
                {
                    //if (typeof localStorage[prop] !== 'function' && prop != 'number')
                    {
                        */var o = JSON.parse(localStorage.getItem(num));
                        //console.log('Num of customer in LS: ', num);
                        this.number = Number(num);

                        for (var key in o)
                        {
                            if (o.hasOwnProperty(key))
                            {
                                //console.log('From LS to customer: ', key, ' / ', o[key]);
                                this[key] = o[key];
                            }
                        }
                    /*}
                }
            }*/
            ////console.log('\nAfter feeling ... : ', this);
        },
        ////////


        // save Customer data IN localStorage
        storeCustomerData : function()
        {
            localStorage.setItem((this.number).toString(), JSON.stringify(this.getCustomerProperties(true)));
            console.log('Data stored!: ', localStorage.getItem(this.number));

        },

        saveCustomerMoney : function()
        {
            //console.log('Customer data in locaStorage: ', localStorage.getItem(this.number.toString()));

            var obj = this.getCustomerProperties();
            console.log('Exit OBJ: ', obj);

            //localStorage.setItem(this.number.toString(), JSON.stringify(obj));

            /*var obj = JSON.parse(localStorage.getItem(this.number.toString()));
            obj.money = 666;
            localStorage.setItem(this.number.toString(), JSON.stringify(obj));
            console.log('Changed localStorage: ', localStorage);*/
        }

    };

    (function()
    {
        customer.loadAccount();
    }());


    /*var customerName = customer.getCustomerName(),
        customerPin = customer.getCustomerPinCode(),
        customerMoney = customer.getCustomerAccountStatus();*/
    console.log('Default customer: ', customer.getCustomerName(), ' ', customer.getCustomerPinCode(), ' ', customer.getCustomerAccountStatus());

    function checkElementInClass() //elemClass, elemId) //elemClass, elemId)
    {
        // 'buttonLi', location.href.slice(location.href.indexOf('#')+1));

        var elemId = location.href.slice(location.href.indexOf('#')+1),
            elem = document.getElementById(elemId),
            currentElem = screensObj.getProperties(elemId);

        //last version
        /*var elem = document.getElementsByCla
        ssName(elemClass),
         currentElem = screensObj.getProperties(elemId);*/

        ////console.log('elem: ', elem, /*' elemClass: ', elemClass, */' currentElem: ', currentElem, ' elemId: ', elemId);

        if (elem.id.indexOf(currentElem.slice(0, currentElem.indexOf('-'))) > -1)
        {
            ////console.log('Current input: ', document.getElementById(currentElem).querySelector('[title]'));
            return document.getElementById(currentElem).querySelector('[title]');

        }

        /*var elem = document.getElementsByClassName('buttonLi'),
            currentElem = screensObj.getProperties(elemId); //location.href.slice(location.href.indexOf('#')+1));*/

        /*for (var i = 0, el = elem.length; i < el; i++)
        {
            console.log('ID / id: ', elem[i].id, ' || ', elemId);

            if (elem[i].id.indexOf(currentElem.slice(0, currentElem.indexOf('-'))) > -1)
            {
                //console.log('Current input: ', document.getElementById(currentElem).querySelector('[title]'));
                return document.getElementById(currentElem).querySelector('[title]');

            }

        }*/
    }

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

        var correctPin = Number(customer.getCustomerPinCode()); // 1234; ////Number(owner.getOwnerPinCode());

        function eventsHandling(d)
        {
            var slotListening = true,
                pinDigitStatus = 0, //0 - disallowed, 1 - allowed
                minimumPinLen = 4,
                canCheckPin = false,
                pinCount = 0,
                maxPinCount = 3,
                failCount = document.getElementById('wrongPin').childNodes[5],
                moneyDigitStatus = false,
                canMoveMoney = false;

            d.getElementById('interface').addEventListener('click', interfaceHandler, false);
            d.getElementById('keyboard').addEventListener('click', function(ev)
            {

                if (!moneyDigitStatus)
                {
                    ////console.log('EV!: ', ev.target.innerHTML);
                    var pinInput = d.getElementsByClassName('typeDigits')[pinDigitStatus - 1];
                             //console.log('?pinCount: ', pinCount);
                    if (ev.target.tagName.toUpperCase() !== 'DIV' && pinDigitStatus > 0 && Number(ev.target.innerHTML) >= 0)
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
                    else if (ev.target.innerHTML === 'Del' && pinDigitStatus > 0)
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
                            pinDigitStatus = checkPin(ev, pinInput, correctPin, pinCount, maxPinCount, failCount);
                            ////console.log('[R]digitStatus?: ', digitStatus);

                            //console.log('after return: ',moneyDigitStatus);
                            if (pinDigitStatus === 1) moneyDigitStatus = true;
                        }
                    }
                }

                else
                {

                   /* to FIX => make sure of places when digits can be used  */

                    var currentInput = checkElementInClass(); //'buttonLi', location.href.slice(location.href.indexOf('#')+1)); //'buttonLi', location.href.slice(location.href.indexOf('#')+1));

                    if (ev.target.tagName.toUpperCase() !== 'DIV' && Number(ev.target.innerHTML) >= 0)
                    {
                        //console.log('Current menu is: ', location.href.slice(location.href.indexOf('#')));

                        //currentInput = checkElementInClass('buttonLi', location.href.slice(location.href.indexOf('#')+1));

                        //console.log('Double? ', currentInput.value, ' || ', ev.target.innerHTML);

                        currentInput.value += ev.target.innerHTML;

                        if (currentInput.value.length > 1 && currentInput.value.length <= 4)
                        {
                            canMoveMoney = true;
                            //console.log('Try to move money...');
                        }

                    }

                    else if (ev.target.innerHTML === 'Del' && currentInput.value.length > 0)
                    {
                        //console.log('remove it?');
                        currentInput.value = currentInput.value.slice(0, -1);
                        if (currentInput.value.length <= 2)
                            canMoveMoney = false;
                    }

                    else if (ev.target.innerHTML === 'OK' && canMoveMoney === true)
                    {
                        var operationSuccess = false;

                        if (Number(currentInput.value) >= 50 && Number(currentInput.value) <= 4000)
                        {
                            if (currentInput.title === 'deposit-cash')
                                operationSuccess = customer.depositCustomerMoney(currentInput.value);
                            else if (currentInput.title === 'withdraw-cash')
                                operationSuccess = customer.withdrawCustomerMoney(currentInput.value);

                            ////console.log('Current menu: ', currentInput);
                            /*console.log('Money moved!!');*/

                            if (operationSuccess)
                                currentInput.value = '';
                        }
                        else if (Number(currentInput.value) < 50)
                            alert('Minimalna kwota to 50 PLN!');
                        else if (Number(currentInput.value) > 4000)
                            alert('Maksymalna kwota to 4000 PLN!');
                    }

                }

                //console.log(moneyDigitStatus);

            }, false);
            d.getElementById('slots').addEventListener('click', function(ev)
            {
                slotsHandler(ev, intervalId, iC, s, cS, slotListening);
                slotListening = false;
                pinDigitStatus = 1;
            }, false);

            d.getElementById('resetButton').addEventListener('click', function(ev)
            {
                //alert('reset?');
                resetAllData();
            }, false);

        }
        eventsHandling(document);

    }
    start();

//}());
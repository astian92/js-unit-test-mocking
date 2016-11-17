
mocha.setup('bdd');
expect = chai.expect;
chai.should();

describe("#ajax - Ajax extensions I have written to simplify ajax calls", function () {
    it("get Test", function () {
        let url = "http://Test/get";
        let settings = { conf1: 1, conf2: false };
        let finalArg = { type: "GET", url: url, data: undefined, conf1: settings.conf1, conf2: settings.conf2 };

        let ajaxStub = sinon.stub($, "ajax", function (arg) {
            return arg;
        });

        let expected = Ajax.get(url, settings);

        //test that it was called only once
        expect(ajaxStub.calledOnce).to.be.true;

        //test that the arguments were assembled correctly
        let argumentsWerePropagated = ajaxStub.calledWith(finalArg);
        expect(argumentsWerePropagated).to.be.true;

        //test if it propagates the result from the stub back to the caller (usually it should be a promise but I stubbed it to return the param itsel);
        expect(expected).to.eql(finalArg);

        $.ajax.restore();
    });

    it("post Test", function () {
        let url = "http://Test/post";
        let settings = { conf1: 1, conf2: false };
        let data = { name: "Martin", age: 24 };
        let finalArg = { type: "POST", url: url, data: data, conf1: settings.conf1, conf2: settings.conf2 };

        let ajaxStub = sinon.stub($, "ajax", function (arg) {
            return arg;
        });

        let expected = Ajax.post(url, data, settings);

        //test it was called only once
        expect(ajaxStub.calledOnce).to.be.true;

        //test that the arguments were correctly assembled
        let argumentsWerePropagated = ajaxStub.calledWith(finalArg);
        expect(argumentsWerePropagated).to.be.true;

        //test if it propagets the result
        expect(expected).to.eql(finalArg);

        $.ajax.restore();
    });

    //it("getAndHandle Test", function () {
    //    //window.InfoNav = { renderResponse: function () { } };
    //    //let infoNavSpy = sinon.stub(InfoNav, "renderResponse");

    //    //let ticket = { Event: "event" };
        
    //    //let promise = sinon.stub($, "ajax")
    //    //    .resolves(ticket);

    //    //let url = "http://Test/getAndHandle";
    //    //let settings = { conf1: 1, conf2: false };
    //    //let finalArg = { type: "GET", url: url, data: undefined, conf1: settings.conf1, conf2: settings.conf2 };

    //    ////Ajax.getAndHandle(url, settings);

    //    ////let propagated = promise.calledWith(finalArg);

    //    ////expect(propagated).to.be.true;

    //    //infoNavSpy.restore();
    //    //$.ajax.restore();
    //});
    it("testing stubs using done", function (done) {
        let returnsPromise = sinon.stub($, "ajax").resolves('success');

        returnsPromise().then(function (result) {
            expect(result).to.equal('success');
            $.ajax.restore();
            done();
        }, function (error) {
            console.log(error);
            $.ajax.restore();
            done();
        })
    });

    it('testing eventually', function () {
        let returnsPromise = sinon.stub($, "ajax").resolves('success');
        return expect(returnsPromise()).should.eventually.equal('success');
        //return expect(returnsPromise).should.eventually.equal('success');
    });

});


describe('#misc', function () {
    describe("RoundNumber(Number, Digits) - rounds up a number up to the number of the digit selected", function () {
        it('RoundNumber Test', function () {
            let input = 4.123456789;
            let expected = 4.13;

            let actual = RoundNumber(input, 2);
            expect(actual).to.equal(expected);
        });
        it('RoundNumber Test with 0 digits', function () {
            let input = 1.234567;
            let expected = 2;

            let actual = RoundNumber(input, 0);
            expect(actual).to.equal(expected);
        });
        it('RoundNumber Test with negative digits', function () {
            let call = function () {
                RoundNumber(1.234, -5);
            }

            expect(call).to.throw();
        });
        it('RoundNumber Test with incorrect number', function () {
            let call = function () {
                RoundNumber("asd", 3);
            }

            expect(call).to.throw();
        });
        it('RoundNumber Test with incorrect digits', function () {
            let call = function () {
                RoundNumbeR(5.654, {});
            }

            expect(call).to.throw();
        });
    });
    
    describe("guid() - returns a string value that represents a valid UID", function () {
        it("guid Test", function () {
            let actual = guid();
            let regex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
            let match = regex.test(actual);

            expect(match).to.be.true;
        })
    })

    describe("Number.pad(size) - extension. Returns a string of the number with number of zeroes infront of it equal to size", function () {
        it("pad Test with size = 5", function () {
            let number = 3;
            let actual = number.pad(5);
            let expected = "00003";

            expect(actual).to.equal(expected);
        });
        it("pad Test with no pads", function () {
            let call = function () { 
                let number = 3;
                number.pad();
            }

            expect(call).to.throw();
        });
        it("pad Test with negative size", function () {
            let call = function () {
                let number = 3;
                number.pad(-3);
            }

            expect(call).to.throw();
        });
        it("pad Test with size = 0", function () {
            let number = 71;
            let actual = number.pad(0);

            let expected = number.toString();
        });
    });

    describe("css(jqueryElement) - returns a FULL specification of every css rule applied to the element! COMING FROM STYLESHEET!", function () {
        it("css Test with this div#mocha - testing if its style to have 20px margin is detected by this method", function () {
            let element = $('#mocha');
            let elementCss = css(element);

            let actual = elementCss["margin"];
            expect(actual).to.equal("20px");
        });
        it("css Test without parameters", function () {
            let call = function () {
                css();
            }

            expect(call).to.throw();
        });
        it("css Test with no element", function () {
            let call = function () {
                css($('.somethingwhichdoesntexist'));
            }

            expect(call).to.throw();
        });
    });

    describe("getCaretPosition(ctrl) - returns a integer showing the caret position in teh ", function () {
        it("getCaretPosition Test", function () {
            let input = $('<input type="text" />');
            input.val('text'); //text = 4 characters 
            let expected = 4;
            let actual = getCaretPosition(input[0]);

            expect(actual).to.equal(expected);
        });
        it("getCaretPosition Test - input no text", function () {
            let input = $('<input type="text" />');
            let expected = 0;
            let actual = getCaretPosition(input[0]);

            expect(actual).to.equal(expected);
        });
    });

    describe("setCaretPosition(ctrl, pos) - sets the cursor(caret) at a certain position. *CHECKING through getCaretPosition to assert... no other way to check result", function () {
        it("setCaretPosition Test", function () {
            let input = $('<input type="text" />');
            input.val('text is longer than last time');

            let expected = 7;
            setCaretPosition(input[0], expected);

            let actual = getCaretPosition(input[0]); //no other way to check ... that I can think of
            expect(actual).to.equal(expected);
        });
        it("setCaretPosition Test - no text in input", function () {
            let input = $('<input type="text" />');
            let expected = 0;
            setCaretPosition(input[0], 7);

            let actual = getCaretPosition(input[0]);
            expect(actual).to.equal(0);
        });
    });

    describe("toHHMM(intMinutes) - Changes minutes (as integer) to hh:mm format", function () {
        it("toHHMM Test", function () {
            let hours = 750;
            let expected = "12:30";
            let actual = toHHMM(hours);

            expect(actual).to.equal(expected);
        });
        it("toHHMM Test - negative intMinutes", function () {
            let hours = -500;
            let expected = "-08:20";
            let actual = toHHMM(hours);

            expect(actual).to.equal(expected);
        });
        it("toHHMM Test - 0 intMinutes", function () {
            let hours = 0;
            let expected = "00:00";
            let actual = toHHMM(hours);

            expect(actual).to.equal(expected);
        });
    });

    describe("toIntMinutes(hhMM) - Changes hh:mm to minutes (as int)", function () {
        it("toIntMuntes Test", function () {
            let input = "12:30";
            let expected = 750;
            let actual = toIntMinutes(input);

            expect(actual).to.equal(expected);
        });
        it("toIntMinutes Test - negative hours", function () {
            let input = "-09:15";
            let expected = -555;
            let actual = toIntMinutes(input);

            expect(actual).to.equal(expected);
        });
        it("toIntMinutes Test - \"00:00\" hhMM", function () {
            let input = "00:00";
            let expected = 0;
            let actual = toIntMinutes(input);

            expect(actual).to.equal(expected);
        });
    });
});

mocha.run();

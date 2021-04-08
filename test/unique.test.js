const { expect } = require("chai");
const { checkTypes, TypedConstructor } = require(__dirname + "/../src/index.js");

describe("Method: checkTypes", function() {

    const data = {
        nm: 100,
        notNm: "ok",
        txt: "ok",
        notTxt: 100,
        fn: () => 100,
        notFn: 100,
        arr: [],
        notArr: {},
        arr3: [1,2,3],
        notArr3: [1,2],
        obj: {},
        notObj: 100,
        bool: true,
        notBool: 100,
        lv1: { lv2: { lv3: 100 } },
        readmeExample1: {
            name: "John",
            direction: "South Carolina",
            age: 64,
            form: {
                comments: "some text",
                details: undefined,
            }
        },
        readmeExample2: { name: undefined, age: 64 }
    };

    
    it("works with number", function () {
        expect(checkTypes(data, "nm:number")).to.equal(true);
        expect(checkTypes(data, "notNm:number")).to.equal(false);
    });
    
    it("works with string", function () {
        expect(checkTypes(data, "txt:string")).to.equal(true);
        expect(checkTypes(data, "notTxt:string")).to.equal(false);
    });
    
    it("works with function", function () {
        expect(checkTypes(data, "fn:function")).to.equal(true);
        expect(checkTypes(data, "notFn:function")).to.equal(false);
    });
    
    it("works with array", function () {
        expect(checkTypes(data, "arr:array")).to.equal(true);
        expect(checkTypes(data, "notArr:array")).to.equal(false);
    });
    
    it("works with array length", function () {
        expect(checkTypes(data, "arr3.length:within(3,3)")).to.equal(true);
        expect(checkTypes(data, "notArr3.length:within(3,3)")).to.equal(false);
    });
    
    it("works with object", function () {
        expect(checkTypes(data, "obj:object")).to.equal(true);
        expect(checkTypes(data, "notObj:object")).to.equal(false);
    });

    it("works with negation", function () {
        expect(checkTypes(data, "lv1.lv2.lv3:!equal(88)&!equal(99)")).to.equal(true);
        expect(checkTypes(data, "lv1.lv2.lv3:!equal(100)")).to.equal(false);
    });
    
    it("works with others", function () {
        expect(checkTypes(data, "bool:boolean")).to.equal(true);
        expect(checkTypes(data, "notBool:boolean")).to.equal(false);
    });
    
    it("works with nested properties", function () {
        expect(checkTypes(data, "lv1.lv2.lv3:equal(100)")).to.equal(true);
        expect(checkTypes(data, "lv1.lv2.lv3:gt(100)")).to.equal(false);
    });
    
    it("works with nested conditions", function () {
        expect(checkTypes(data, "lv1.lv2.lv3:equal(100)&gt(99)")).to.equal(true);
        expect(checkTypes(data, "lv1.lv2.lv3:equal(100)&gt(101)")).to.equal(false);
    });

    it("works with options", function () {
        expect(checkTypes(data, "lv1.lv2.lv3:equal(88)|equal(100)")).to.equal(true);
        expect(checkTypes(data, "lv1.lv2.lv3:equal(88)|equal(99)")).to.equal(false);
    });

    it("works with AND precedence", function () {
        expect(checkTypes(data, "lv1.lv2.lv3:&equal(100)")).to.equal(true);
        expect(checkTypes(data, "lv1.lv2.lv3:&!equal(88)&!equal(99)")).to.equal(true);
    });
    
    it("works with README example", function() {
        expect(checkTypes(data.readmeExample1, `
            name:string;
            direction:string;
            age:number&gt(18);
            form.comments:string|undefined;
            form.details:string|undefined;
        `, true
        )).to.equal(true)
        expect(checkTypes(data.readmeExample1, `
            name:string;
            direction:string;
            age:number&gt(18);
            form.comments:string|undefined;
            form.details:nil;
        `
        )).to.equal(false)
    });

    
    it("works with README example 2", function() {
        expect(checkTypes(data.readmeExample2, `
            name : string | undefined ;
            age : gt( 18 ) ;
        `)).to.equal(true);
    });

});

describe("Class: TypedConstructor", function() {

    it("used by inheritance", function() {

        class Subtype1 extends TypedConstructor {

            static get ConstructorTypes() {
                return "title:string;description:string|nil";
            }

            onConstructor(options, meta = {}) {
                Object.assign(this, options);
                this.details = 0;
            }

        }
        const subtype1 = new Subtype1({ title: "Título", description: "Descripción" });
        const subtype2 = new Subtype1({ title: "Título", description: null });
        let hasFailed3 = false;
        try {
            const subtype3 = new Subtype1({ title: "Título", description: undefined });
        } catch (error) {
            hasFailed3 = true;
        }
        expect(hasFailed3).to.equal(true);
    });
});

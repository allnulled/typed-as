const api = {};
const is = require("is");

class TypedConstructor {

    static $checkTypes(data, rulesText, returnFail = false) {
        // console.log("Checking:", data, rulesText);
        const rules = rulesText.replace(/^;*|;*$/g, "").split(";");
        WithRules:
        for (let indexRule = 0; indexRule < rules.length; indexRule++) {
            const rule = rules[indexRule].trim();
            if((typeof rule === "undefined") || rule === "") {
                continue WithRules;
            }
            const [key = "", expressionRulesText = ""] = rule.split(":").map(r => r.trim()).filter(r => typeof r !== "undefined" && r !== "");
            const propId = key.trim();
            const props = propId.split(".").map(r => r.trim()).filter(r => typeof r !== "undefined" && r !== "");
            const expressionRules = expressionRulesText.split("&").map(r => r.trim()).filter(r => typeof r !== "undefined" && r !== "");
            let target = data;
            WithProperties:
            for(let indexProperty = 0; indexProperty < props.length; indexProperty++) {
                const prop = props[indexProperty];
                if(prop === "") {
                    continue WithProperties;
                }
                if(!(prop in target)) {
                    throw new Error(`[TypedAsError] Property ${props.slice(0, indexProperty).join(".")} was not found in provided data`);
                }
                target = target[prop];
            }
            WithExpressions:
            for (let indexExpression = 0; indexExpression < expressionRules.length; indexExpression++) {
                const expressionRule = expressionRules[indexExpression];
                const validation = expressionRule.trim();
                const validationOptions = validation.split("|").map(r => r.trim()).filter(r => typeof r !== "undefined" && r !== "");
                let isValid = false;
                WithOptions:
                for(let indexOptions = 0; indexOptions < validationOptions.length; indexOptions++) {
                    const validationOptionTmp = validationOptions[indexOptions];
                    const isNegated = validationOptionTmp.indexOf("!") === 0;
                    const validationOption = isNegated ? validationOptionTmp.substr(1).trim() : validationOptionTmp;
                    if(validationOption === "") {
                        continue WithOptions;
                    }
                    let methodName = undefined;
                    let methodParameters = [];
                    if(validationOption.endsWith(")")) {
                        const startParametersPosition = validationOption.indexOf("(");
                        const validationOptionParameters = validationOption.substr(startParametersPosition).trim().replace(/^\(|\)$/g, "").split(",");
                        methodName = validationOption.substr(0, startParametersPosition);
                        methodParameters = validationOptionParameters;
                    } else {
                        methodName = validationOption;
                    }
                    if(typeof is[methodName] !== "function") {
                        throw new Error(`[TypedAsError] Method ${methodName} was not found in 'is' module`);
                    }
                    // console.log(target, methodName, methodParameters);
                    const evaluatedParameters = methodParameters.map(item => eval(item));
                    const resultTmp = is[methodName](target, ...evaluatedParameters);
                    const result = isNegated ? !!!resultTmp : resultTmp;
                    if(result === true) {
                        isValid = true;
                        break WithOptions;
                    }
                }
                // console.log("RESULT:", isValid, target, expressionRule);
                if (isValid === false) {
                    if(returnFail) {
                        return {
                            error: true,
                            target,
                            property: propId,
                            expression: expressionRule,
                        };
                    }
                    return false;
                }
            }
        }
        return true;
    }

    static get ConstructorTypes() {
        return "";
    }
    
    constructor(...args) {
        const [options] = args;
        const isOkay = this.constructor.$checkTypes(options, this.constructor.ConstructorTypes, true);
        if (isOkay !== true) {
            throw new Error(`TypeError:\n- on class ${this.constructor.name}\n- on check ${isOkay.property}:${isOkay.expression}`);
        }
        if(typeof this.onConstructor === "function") {
            this.onConstructor(...args);
        }
    }

    onConstructor() {
        // 
    }

}

api.checkTypes = TypedConstructor.$checkTypes;
api.TypedConstructor = TypedConstructor;

module.exports = api;
export  class A {
    ifeq(a, b, options) {
        if (a === b) {
            return options.fn(this)
        }
        return options.inverse(this)
    }
}


// export const a = Handlebars.registerHelper('ifEq', function(a, b, options) {
//
//         if (a === b) {
//             return options.fn(this)
//         }
//         return options.inverse(this)
//
// });
//


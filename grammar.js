/**
 * @file Math grammar for tree-sitter
 * @author gdar463 <dev@gdar463.com>
 * @license GPL-3.0-only
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "math",
  extras: _$ => [/[ \t\r\n]+/],

  precedences: _$ => [
    [
      "exponential",
      "product",
      "addition",
      "plus_minus",
      "function",
      "comparison",
      "piecewise",
    ],
  ],

  rules: {
    expression: $ => $._expression,
    _expression: $ =>
      choice(
        $._function,
        $.number,
        $.variable,
        $.coeff_variable,
        $.plus_minus,
        $.addition,
        $.subtraction,
        $.product,
        $.division,
        $.exponential,
        $._comp_operator,
        $._parenthesized_expression,
      ),
    _parenthesized_expression: $ => seq("(", $._expression, ")"),

    number: _$ => /-?\d+(\.\d+)?/,
    variable: _$ => token(prec(-1, /[a-zA-Z$]/)),

    coeff_variable: $ =>
      seq(
        field(
          "coefficient",
          choice(
            $._parenthesized_expression,
            $.coeff_variable,
            $.number,
            token("-"),
          ),
        ),
        field("variable", $.variable),
      ),

    plus_minus: $ =>
      prec.left(
        "plus_minus",
        seq(field("left", $._expression), "+-", field("right", $._expression)),
      ),

    addition: $ =>
      prec.left(
        "addition",
        seq(field("left", $._expression), "+", field("right", $._expression)),
      ),
    subtraction: $ =>
      prec.left(
        "addition",
        seq(field("left", $._expression), "-", field("right", $._expression)),
      ),

    product: $ =>
      prec.left(
        "product",
        seq(field("left", $._expression), "*", field("right", $._expression)),
      ),
    division: $ =>
      prec.left(
        "product",
        seq(field("left", $._expression), "/", field("right", $._expression)),
      ),

    exponential: $ =>
      prec.left(
        "exponential",
        seq(
          field("base", $._expression),
          token(choice("**", "^")),
          field("exponent", $._expression),
        ),
      ),

    _comp_operator: $ =>
      choice(
        $.equals,
        $.not_equals,
        $.less_than,
        $.less_than_equals,
        $.more_than,
        $.more_than_equals,
      ),

    equals: $ =>
      prec.left(
        "comparison",
        seq(field("left", $._expression), "=", field("right", $._expression)),
      ),
    not_equals: $ =>
      prec.left(
        "comparison",
        seq(field("left", $._expression), "!=", field("right", $._expression)),
      ),
    less_than: $ =>
      prec.left(
        "comparison",
        seq(field("left", $._expression), "<", field("right", $._expression)),
      ),
    less_than_equals: $ =>
      prec.left(
        "comparison",
        seq(field("left", $._expression), "<=", field("right", $._expression)),
      ),
    more_than: $ =>
      prec.left(
        "comparison",
        seq(field("left", $._expression), ">", field("right", $._expression)),
      ),
    more_than_equals: $ =>
      prec.left(
        "comparison",
        seq(field("left", $._expression), ">=", field("right", $._expression)),
      ),

    _function: $ =>
      choice(
        $.natural_logarithm,
        $.logarithm,
        $.absolute_value,
        $.square_root,
        $.nth_root,
        $.limit,
        $.derivative,
        $.rolle,
        $.lagrange,
        $.piecewise,
        $._trig_function,
      ),

    natural_logarithm: $ =>
      choice($._natural_logarithm_ln, $._natural_logarithm_log),
    _natural_logarithm_ln: $ =>
      prec(
        "function",
        seq(
          token(choice("ln", "loge")),
          "(",
          field("argument", $._expression),
          ")",
        ),
      ),
    _natural_logarithm_log: $ =>
      prec(
        "function",
        seq(token("log"), "(", field("argument", $._expression), ")"),
      ),

    logarithm: $ =>
      prec(
        "function",
        seq(
          token("log"),
          field("base", choice($.number, $.variable)),
          "(",
          field("argument", $._expression),
          ")",
        ),
      ),

    absolute_value: $ =>
      prec(
        "function",
        seq(token("abs"), "(", field("argument", $._expression), ")"),
      ),

    square_root: $ =>
      prec(
        "function",
        seq(
          token(choice("sqrt", "root2")),
          "(",
          field("argument", $._expression),
          ")",
        ),
      ),

    nth_root: $ =>
      prec(
        "function",
        seq(
          token("root"),
          field("degree", choice($.number, $.variable)),
          "(",
          field("argument", $._expression),
          ")",
        ),
      ),

    limit: $ =>
      prec(
        "function",
        seq(
          token("lim"),
          field("variable", $.variable),
          "->",
          field("point", choice($.number, $.variable)),
          optional(field("direction", token(choice("+", "-")))),
          "(",
          field("function", $._expression),
          ")",
        ),
      ),

    derivative: $ =>
      prec.left(
        "function",
        seq(
          token("d/d"),
          field("variable", $.variable),
          field("function", $._expression),
        ),
      ),

    _trig_function: $ =>
      choice(
        $.sine,
        $.cosine,
        $.tangent,
        $.cosecant,
        $.secant,
        $.cotangent,
        $.arcsine,
        $.arccosine,
        $.arctangent,
        $.arccosecant,
        $.arcsecant,
        $.arccotangent,
      ),

    sine: $ =>
      prec.left(
        "function",
        choice(
          seq(token("sin"), "(", field("argument", $._expression), ")"),
          seq(
            token("sin"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    cosine: $ =>
      prec.left(
        "function",
        choice(
          seq(token("cos"), "(", field("argument", $._expression), ")"),
          seq(
            token("cos"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    tangent: $ =>
      prec.left(
        "function",
        choice(
          seq(token("tan"), "(", field("argument", $._expression), ")"),
          seq(
            token("tan"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    cosecant: $ =>
      prec.left(
        "function",
        choice(
          seq(token("csc"), "(", field("argument", $._expression), ")"),
          seq(
            token("csc"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    secant: $ =>
      prec.left(
        "function",
        choice(
          seq(token("sec"), "(", field("argument", $._expression), ")"),
          seq(
            token("sec"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    cotangent: $ =>
      prec.left(
        "function",
        choice(
          seq(token("cot"), "(", field("argument", $._expression), ")"),
          seq(
            token("cot"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    arcsine: $ =>
      prec.left(
        "function",
        choice(
          seq(token("arcsin"), "(", field("argument", $._expression), ")"),
          seq(
            token("arcsin"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    arccosine: $ =>
      prec.left(
        "function",
        choice(
          seq(token("arccos"), "(", field("argument", $._expression), ")"),
          seq(
            token("arccos"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    arctangent: $ =>
      prec.left(
        "function",
        choice(
          seq(token("arctan"), "(", field("argument", $._expression), ")"),
          seq(
            token("arctan"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    arccosecant: $ =>
      prec.left(
        "function",
        choice(
          seq(token("arccsc"), "(", field("argument", $._expression), ")"),
          seq(
            token("arccsc"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    arcsecant: $ =>
      prec.left(
        "function",
        choice(
          seq(token("arcsec"), "(", field("argument", $._expression), ")"),
          seq(
            token("arcsec"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),
    arccotangent: $ =>
      prec.left(
        "function",
        choice(
          seq(token("arccot"), "(", field("argument", $._expression), ")"),
          seq(
            token("arccot"),
            field("argument", choice($.coeff_variable, $.variable)),
          ),
        ),
      ),

    interval_both_inclusive: $ =>
      seq("[", field("left", $.number), ";", field("right", $.number), "]"),

    rolle: $ =>
      prec.left(
        "function",
        seq(
          token("rolle"),
          "(",
          field("function", $._expression),
          ",",
          field("interval", $.interval_both_inclusive),
          ")",
        ),
      ),

    lagrange: $ =>
      prec.left(
        "function",
        seq(
          token("lagrange"),
          "(",
          field("function", $._expression),
          ",",
          field("interval", $.interval_both_inclusive),
          ")",
        ),
      ),

    piecewise: $ =>
      prec.left(
        "piecewise",
        seq(token("piecewise"), "(", field("cases", $.cases), ")"),
      ),
    cases: $ => repeat1(seq($.case, optional(seq(",", $.case)))),
    case: $ =>
      seq(
        "{",
        field("function", $._expression),
        ",",
        field("interval", $._comp_operator),
        "}",
      ),
  },
});

const AddressesUsingIdsQuery = require('../../layout/AddressesUsingIdsQuery');
const VariableStore = require('../../lib/VariableStore');
const diff = require('deep-diff').diff;

module.exports.tests = {};

module.exports.tests.base_render = (test, common) => {
  test('VariableStore without admins should not add any shoulds', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/AddressesUsingIdsQuery/no_layers.json');

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

    t.deepEquals(actual, expected);
    t.end();

  });

  test('VariableStore with admins should only use non-empty id arrays', (t) => {
    const query = new AddressesUsingIdsQuery();

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');
    vs.var('input:layers', JSON.stringify({
      'layer1': [1, 2, 3],
      'layer2': [],
      'layer3': undefined,
      'layer4': [4]
    }));

    const actual = query.render(vs);
    const expected = require('../fixtures/AddressesUsingIdsQuery/with_layers.json');

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

    t.deepEquals(actual, expected);
    t.end();

  });

};

module.exports.tests.render_with_scores = (test, common) => {
  test('all scores should be added as functions', (t) => {
    // ensures that score functions are called
    t.plan(4);

    const query = new AddressesUsingIdsQuery();
    query.score((vs) => {
      t.ok(vs);
      return { 'score field 1': 'score value 1' };
    });
    query.score((vs) => {
      t.ok(vs);
      return false;
    });
    query.score((vs) => {
      t.ok(vs);
      return { 'score field 2': 'score value 2' };
    });

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/AddressesUsingIdsQuery/with_scores.json');

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

    t.deepEquals(actual, expected);
    t.end();

  });

};

module.exports.tests.render_with_filters = (test, common) => {
  test('all filters should be added as musts', (t) => {
    // ensures that filter functions are called
    t.plan(4);

    const query = new AddressesUsingIdsQuery();
    query.filter((vs) => {
      t.ok(vs);
      return { 'filter field 1': 'filter value 1' };
    });
    query.filter((vs) => {
      t.ok(vs);
      return false;
    });
    query.filter((vs) => {
      t.ok(vs);
      return { 'filter field 2': 'filter value 2' };
    });

    const vs = new VariableStore();
    vs.var('size', 'size value');
    vs.var('track_scores', 'track_scores value');
    vs.var('input:housenumber', 'housenumber value');
    vs.var('input:street', 'street value');

    const actual = query.render(vs);
    const expected = require('../fixtures/AddressesUsingIdsQuery/with_filters.json');

    // console.error(JSON.stringify(actual));
    // console.error(JSON.stringify(expected));

    t.deepEquals(actual, expected);
    t.end();

  });

};

module.exports.all = (tape, common) => {
  function test(name, testFunction) {
    return tape(`AddressesUsingIdsQuery ${name}`, testFunction);
  }
  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};

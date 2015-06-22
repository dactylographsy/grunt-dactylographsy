var expect = require('chai').expect,
    fs = require('fs'),
    FileAnalyzer = require('../../../tasks/modules/file-analyzer'),
    fileAnalyzer;

describe('FileAnalyzer specification', function() {
  beforeEach(function() {
    fileAnalyzer = new FileAnalyzer();
  });

  it('returns files and omits directories', function() {
    var glob = [{
      src: ['./test/task/fixtures']
    }];

    var files = fileAnalyzer.getFiles(glob);

    expect(files).to.have.length(0);
  });
});

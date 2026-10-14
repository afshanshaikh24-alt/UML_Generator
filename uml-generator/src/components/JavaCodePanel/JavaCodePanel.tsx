import React, { useState, useMemo, useCallback } from 'react';
import { useDiagramStore } from '../../store/diagramStore';
import { generateAllJava } from '../../utils/javaGenerator';
import { downloadJavaZip, downloadSingleJava } from '../../utils/export';
import { Copy, Download, RefreshCw, FileCode, ChevronDown, ChevronUp, Package } from 'lucide-react';
import toast from 'react-hot-toast';

function syntaxHighlight(code: string): React.ReactNode[] {
  const keywords = ['public', 'private', 'protected', 'class', 'interface', 'abstract', 'final', 'static',
    'void', 'return', 'extends', 'implements', 'new', 'this', 'super', 'package', 'import', 'null', 'true', 'false'];
  const types = ['int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short', 'String', 'Integer',
    'List', 'ArrayList', 'Map', 'HashMap', 'Set', 'Object', 'void'];

  const lines = code.split('\n');
  return lines.map((line, li) => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Comment
    if (remaining.trimStart().startsWith('//')) {
      tokens.push(<span key={key++} className="token-comment">{remaining}</span>);
      return <div key={li}>{tokens}<br /></div>;
    }

    // Tokenize
    while (remaining.length > 0) {
      // String literals
      const strMatch = remaining.match(/^"[^"]*"/);
      if (strMatch) {
        tokens.push(<span key={key++} className="token-string">{strMatch[0]}</span>);
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      // Word token
      const wordMatch = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
      if (wordMatch) {
        const word = wordMatch[0];
        if (keywords.includes(word)) {
          tokens.push(<span key={key++} className="token-keyword">{word}</span>);
        } else if (types.includes(word)) {
          tokens.push(<span key={key++} className="token-type">{word}</span>);
        } else if (/^[A-Z]/.test(word)) {
          tokens.push(<span key={key++} className="token-class-name">{word}</span>);
        } else {
          tokens.push(<span key={key++}>{word}</span>);
        }
        remaining = remaining.slice(word.length);
        continue;
      }

      // Number
      const numMatch = remaining.match(/^[0-9]+(\.[0-9]+)?[LlFfDd]?/);
      if (numMatch) {
        tokens.push(<span key={key++} className="token-number">{numMatch[0]}</span>);
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }

      // Punctuation
      tokens.push(<span key={key++}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }

    return <div key={li}>{tokens}</div>;
  });
}

const JavaCodePanel: React.FC = () => {
  const { diagram } = useDiagramStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('__all__');
  const [generated, setGenerated] = useState<Map<string, string>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);

  const fileNames = useMemo(() => ['__all__', ...Array.from(generated.keys())], [generated]);

  const currentCode = useMemo(() => {
    if (selectedFile === '__all__') {
      const allCode: string[] = [];
      generated.forEach((code, name) => {
        allCode.push(`// ===== ${name} =====`);
        allCode.push(code);
        allCode.push('');
      });
      return allCode.join('\n');
    }
    return generated.get(selectedFile) ?? '';
  }, [generated, selectedFile]);

  const handleGenerate = useCallback(async () => {
    if (diagram.classes.length === 0) {
      toast.error('No classes to generate code for');
      return;
    }
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 200));
    try {
      const result = generateAllJava(diagram);
      setGenerated(result);
      setSelectedFile('__all__');
      setIsOpen(true);
      toast.success(`Generated ${result.size} Java file${result.size > 1 ? 's' : ''}`);
    } catch (e) {
      toast.error('Code generation failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  }, [diagram]);

  const handleCopy = useCallback(() => {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode);
    toast.success('Copied to clipboard');
  }, [currentCode]);

  const handleDownloadAll = useCallback(async () => {
    if (generated.size === 0) {
      toast.error('Generate code first');
      return;
    }
    await downloadJavaZip(generated, diagram.name);
    toast.success('Downloaded ZIP file');
  }, [generated, diagram.name]);

  const handleDownloadSingle = useCallback(() => {
    if (!currentCode || selectedFile === '__all__') {
      toast.error('Select a specific file to download');
      return;
    }
    downloadSingleJava(currentCode, selectedFile);
    toast.success(`Downloaded ${selectedFile}`);
  }, [currentCode, selectedFile]);

  const lineCount = currentCode.split('\n').length;

  return (
    <div className={`bg-[#0f1117] border-t border-[#2d3148] flex flex-col transition-all duration-300 ${isOpen ? 'h-72' : 'h-10'}`}>
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#2d3148] flex-shrink-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors"
        >
          <FileCode size={14} />
          <span className="text-xs font-medium">Java Output</span>
          {generated.size > 0 && (
            <span className="bg-indigo-600/30 text-indigo-400 text-[10px] px-1.5 py-0.5 rounded-full">
              {generated.size} files
            </span>
          )}
          {isOpen ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-500 transition-colors disabled:opacity-70"
          >
            <RefreshCw size={11} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
          {generated.size > 0 && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 bg-[#252836] border border-[#2d3148] text-[#94a3b8] rounded text-xs hover:bg-[#2d3148] transition-colors"
                title="Copy"
              >
                <Copy size={11} />
              </button>
              <button
                onClick={handleDownloadSingle}
                disabled={selectedFile === '__all__'}
                className="flex items-center gap-1 px-2 py-1 bg-[#252836] border border-[#2d3148] text-[#94a3b8] rounded text-xs hover:bg-[#2d3148] transition-colors disabled:opacity-40"
                title="Download current file"
              >
                <Download size={11} />
              </button>
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 rounded text-xs hover:bg-emerald-600/30 transition-colors"
                title="Download all as ZIP"
              >
                <Package size={11} /> ZIP
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="flex flex-1 overflow-hidden">
          {/* File tabs */}
          {generated.size > 0 && (
            <div className="w-40 border-r border-[#2d3148] overflow-y-auto flex-shrink-0">
              {fileNames.map((fname) => (
                <button
                  key={fname}
                  onClick={() => setSelectedFile(fname)}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors truncate ${
                    selectedFile === fname
                      ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500'
                      : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1a1d27]'
                  }`}
                  title={fname}
                >
                  {fname === '__all__' ? '📋 All Classes' : `☕ ${fname}`}
                </button>
              ))}
            </div>
          )}

          {/* Code view */}
          <div className="flex-1 overflow-auto code-container p-4">
            {currentCode ? (
              <div className="relative">
                <pre className="text-xs leading-5">
                  {syntaxHighlight(currentCode)}
                </pre>
                <div className="absolute top-0 right-0 text-[10px] text-[#3d4166] mt-1 mr-1">
                  {lineCount} lines
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-3xl mb-3 opacity-20">☕</div>
                  <p className="text-[#64748b] text-sm">Click "Generate" to create Java code</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JavaCodePanel;

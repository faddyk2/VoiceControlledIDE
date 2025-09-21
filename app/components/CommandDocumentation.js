"use client";
import { useState, useMemo } from 'react';
import { commandCategories, allCommands, helpTips } from '../data/commands';
import VoiceStatus from './VoiceStatus';
import styles from './CommandDocumentation.module.css';

const CommandDocumentation = ({ isListening = false, lastCommand = '', commandFound = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Program Control']));
  const [copiedCommand, setCopiedCommand] = useState('');

  // Filter commands based on search and category
  const filteredCommands = useMemo(() => {
    if (selectedCategory === 'all') {
      if (!searchTerm) return commandCategories;
      
      const filtered = {};
      Object.entries(commandCategories).forEach(([categoryName, categoryData]) => {
        const matchingCommands = categoryData.commands.filter(cmd =>
          cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.syntax.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matchingCommands.length > 0) {
          filtered[categoryName] = {
            ...categoryData,
            commands: matchingCommands
          };
        }
      });
      return filtered;
    } else {
      const categoryData = commandCategories[selectedCategory];
      if (!categoryData) return {};
      
      const matchingCommands = categoryData.commands.filter(cmd =>
        cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.syntax.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return matchingCommands.length > 0 ? {
        [selectedCategory]: {
          ...categoryData,
          commands: matchingCommands
        }
      } : {};
    }
  }, [searchTerm, selectedCategory]);

  const toggleCategory = (categoryName) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(text);
      setTimeout(() => setCopiedCommand(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const totalCommands = Object.values(commandCategories).reduce(
    (total, category) => total + category.commands.length, 0
  );

  return (
    <div className={styles.documentationContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          🎤 Voice Commands Documentation
        </h2>
        <p className={styles.subtitle}>
          {totalCommands} commands available • Interactive guide
        </p>
      </div>

      {/* Voice Status */}
      <VoiceStatus 
        isListening={isListening}
        lastCommand={lastCommand}
        commandFound={commandFound}
      />

      {/* Search and Filter */}
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="all">All Categories</option>
          {Object.keys(commandCategories).map(category => (
            <option key={category} value={category}>
              {commandCategories[category].icon} {category}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Help Tips */}
      <div className={styles.helpTips}>
        <h3 className={styles.tipsTitle}>💡 Quick Tips</h3>
        <div className={styles.tipsGrid}>
          {helpTips.map((tip, index) => (
            <div key={index} className={styles.tip}>
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Commands */}
      <div className={styles.commandsContainer}>
        {Object.keys(filteredCommands).length === 0 ? (
          <div className={styles.noResults}>
            <span className={styles.noResultsIcon}>🔍</span>
            <p>No commands found matching your search.</p>
          </div>
        ) : (
          Object.entries(filteredCommands).map(([categoryName, categoryData]) => (
            <div key={categoryName} className={styles.category}>
              <div 
                className={styles.categoryHeader}
                onClick={() => toggleCategory(categoryName)}
              >
                <span className={styles.categoryIcon}>{categoryData.icon}</span>
                <h3 className={styles.categoryTitle}>{categoryName}</h3>
                <span className={styles.commandCount}>
                  {categoryData.commands.length} commands
                </span>
                <span className={styles.expandIcon}>
                  {expandedCategories.has(categoryName) ? '▼' : '▶'}
                </span>
              </div>
              
              <p className={styles.categoryDescription}>{categoryData.description}</p>
              
              {expandedCategories.has(categoryName) && (
                <div className={styles.commandsList}>
                  {categoryData.commands.map((command, index) => (
                    <div key={index} className={styles.commandItem}>
                      <div className={styles.commandHeader}>
                        <h4 className={styles.commandName}>
                          {command.command}
                        </h4>
                        <button
                          onClick={() => copyToClipboard(command.example)}
                          className={styles.copyButton}
                          title="Copy example"
                        >
                          {copiedCommand === command.example ? '✅' : '📋'}
                        </button>
                      </div>
                      
                      <p className={styles.commandDescription}>
                        {command.description}
                      </p>
                      
                      <div className={styles.commandDetails}>
                        <div className={styles.syntaxContainer}>
                          <span className={styles.label}>Syntax:</span>
                          <code className={styles.syntax}>{command.syntax}</code>
                        </div>
                        
                        <div className={styles.exampleContainer}>
                          <span className={styles.label}>Example:</span>
                          <code className={styles.example}>{command.example}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>💬 Speak clearly and use exact syntax for best results</p>
        <p>🔊 Check your microphone permissions if commands aren&apos;t working</p>
      </div>
    </div>
  );
};

export default CommandDocumentation;
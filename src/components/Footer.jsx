import React from 'react';
import { CloudSun, Shield, RefreshCw, Heart, Github, ExternalLink } from 'lucide-react';

export const Footer = ({ lastUpdated, provider = 'Open-Meteo' }) => {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <CloudSun size={20} className="footer-logo" />
          <span className="footer-title">Atmosphere</span>
          <span className="footer-tagline">— Precision Weather Intelligence</span>
        </div>

        <div className="footer-meta">
          {lastUpdated && (
            <div className="footer-updated">
              <RefreshCw size={12} />
              <span>Last updated: {lastUpdated}</span>
            </div>
          )}
          <div className="footer-attribution">
            <Shield size={12} />
            <span>Data provided by {provider}</span>
          </div>
        </div>

        <div className="footer-copyright">
          <p className="footer-creator-line">
            Built with <Heart size={14} className="footer-heart-icon text-rose fill-rose" /> by <strong>Anjan Shetty</strong>
            <span className="dot-separator">•</span>
            <a
              href="https://github.com/codexanjan"
              target="_blank"
              rel="noopener noreferrer"
              className="github-footer-link"
              title="Go to Anjan Shetty's GitHub profile (@codexanjan)"
            >
              <Github size={14} className="github-icon" />
              <span>Go to my GitHub</span>
              <ExternalLink size={11} className="ext-icon" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

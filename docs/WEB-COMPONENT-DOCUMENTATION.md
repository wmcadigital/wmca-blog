# Web Component Documentation Index

Complete documentation for the WMCA Blog Web Component and Umbraco integration.

## 📚 Documentation Files

### Getting Started

1. **[WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md)** - Main documentation
   - Overview and architecture
   - Quick start guide
   - Installation instructions
   - Configuration options
   - API reference (methods, properties, attributes)
   - Styling and theming
   - Security best practices
   - Code examples for React, Vue, plain JavaScript

2. **[WEB-COMPONENT-CONVERSION.md](./WEB-COMPONENT-CONVERSION.md)** - How it works
   - What is a web component?
   - Architecture diagram
   - Files created and their purpose
   - Build and deployment overview
   - Quick development setup

3. **[WEB-COMPONENT-INTEGRATION.md](./WEB-COMPONENT-INTEGRATION.md)** - Integration guide
   - Umbraco integration guide
   - CDN deployment instructions
   - Environment variables
   - Security and sandboxing
   - Styling within Umbraco

### Implementation Guides

4. **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)** - Deploy to production
   - Step-by-step deployment process
   - Options: Vercel, Azure, self-hosted, Docker
   - CDN upload instructions
   - Environment variable setup
   - Post-deployment checklist
   - Monitoring and troubleshooting
   - Rollback procedures
   - Performance optimization
   - CI/CD setup (GitHub Actions, GitLab)

5. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues guide
   - Quick diagnostics commands
   - Component not appearing - causes and solutions
   - Component blank - diagnosis and fixes
   - CORS errors - detailed explanations
   - Navigation issues - testing and solutions
   - Performance optimization tips
   - Styling issues - Shadow DOM limitations
   - Event listener problems
   - Multiple instances troubleshooting
   - FAQ section

### Code Examples

6. **[umbraco-template-example.cshtml](./umbraco-template-example.cshtml)** - Ready-to-use Umbraco template
   - Complete C# Razor template showing:
     - How to render the web component
     - How to pass configuration from content model
     - How to interact with component via JavaScript
     - How to handle navigation events

### Demo

7. **[demo.html](../demo.html)** - Interactive demo page
   - Live component examples
   - Tabbed interface showing features
   - Control buttons (reload, navigate)
   - Light and dark theme variants
   - Code samples you can copy

---

## 🚀 Quick Start Paths

### For Content Managers (Umbraco)

1. Read: [WEB-COMPONENT-CONVERSION.md](./WEB-COMPONENT-CONVERSION.md) (5 min)
2. Reference: [umbraco-template-example.cshtml](./umbraco-template-example.cshtml)
3. Copy code into your template
4. Done! Blog is embedded

### For Developers (Adding to Website)

1. Read: [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md) - Quick Start section (5 min)
2. Copy-paste HTML/JavaScript from examples
3. Run: `npm run web-component:build` (if building yourself)
4. Deploy: Follow [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) (20 min)
5. Done! Component is live

### For DevOps/Infrastructure

1. Read: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) (15 min)
2. Choose deployment platform (Vercel, Azure, Docker, etc.)
3. Follow step-by-step instructions
4. Set up CI/CD (optional)
5. Configure environment variables
6. Done! App is deployed

### For Troubleshooting

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Run diagnostic commands in browser console
3. Match your symptom to a solution
4. Apply the fix
5. If still stuck, see "Getting Help" section

---

## 📋 Implementation Checklist

### Phase 1: Preparation
- [ ] Read WEB-COMPONENT-CONVERSION.md
- [ ] Understand the architecture
- [ ] Review code examples that match your use case
- [ ] Identify hosting platform (Vercel, Azure, self-hosted)
- [ ] Decide on CDN provider for web component script

### Phase 2: Build & Deploy App
- [ ] Run `npm install`
- [ ] Test locally: `npm run next:dev`
- [ ] Verify blog works at http://localhost:3000
- [ ] Deploy: Follow DEPLOYMENT-GUIDE.md for your platform
- [ ] Get public URL (e.g., https://wmca-blog.vercel.app)
- [ ] Verify deployment works in browser

### Phase 3: Build & Deploy Component
- [ ] Run `npm run web-component:build`
- [ ] Verify output: `web-component-dist/wmca-blog-component.js`
- [ ] Upload to CDN (or static server)
- [ ] Verify script is accessible: `curl https://cdn.example.com/...`

### Phase 4: Integration
- [ ] Update your template/HTML (Umbraco, React, Vue, plain HTML)
- [ ] Add `<wmca-blog>` element
- [ ] Add `<script>` tag pointing to component
- [ ] Set `app-url` attribute to your deployed app
- [ ] Test in development first
- [ ] Deploy template changes to staging
- [ ] Test in staging environment

### Phase 5: Testing
- [ ] Component appears in browser
- [ ] Blog content loads
- [ ] Navigation works (articles, filters, search)
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Light and dark themes render correctly
- [ ] No console errors
- [ ] Performance acceptable (Lighthouse > 80)
- [ ] CORS working for API calls

### Phase 6: Production Deployment
- [ ] Final staging test
- [ ] Deploy to production
- [ ] Verify in production
- [ ] Monitor for errors
- [ ] Gather user feedback

---

## 🔗 File Organization

```
wmca-blog/
├── docs/
│   ├── WEB-COMPONENT-README.md          ← Main documentation
│   ├── WEB-COMPONENT-CONVERSION.md      ← How it works
│   ├── WEB-COMPONENT-INTEGRATION.md     ← Integration guide
│   ├── WEB-COMPONENT-DOCUMENTATION.md   ← This file
│   ├── DEPLOYMENT-GUIDE.md              ← Deploy to production
│   ├── TROUBLESHOOTING.md               ← Common issues
│   ├── umbraco-template-example.cshtml  ← Ready-to-use template
│   └── development.md                   ← Local development
│
├── src/
│   ├── WebComponent.js                  ← Component source code
│   └── web-component-entry.js           ← Component build entry
│
├── scripts/
│   └── build-web-component.js           ← Build script
│
├── web-component-dist/
│   └── wmca-blog-component.js           ← Built component (output)
│
├── demo.html                            ← Interactive demo page
├── next.config.js                       ← Next.js configuration
└── package.json                         ← npm scripts
```

---

## 🎯 Common Tasks

### How do I...

#### ...embed the blog in Umbraco?
See: [umbraco-template-example.cshtml](./umbraco-template-example.cshtml) (2 min)

#### ...add the blog to my React app?
See: [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md#react-component-wrapper) (5 min)

#### ...add the blog to my Vue app?
See: [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md#vue-component-wrapper) (5 min)

#### ...deploy the Next.js app?
See: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md#step-3-deploy-nextjs-app) (20 min)

#### ...deploy the web component script?
See: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md#step-4-upload-web-component-script) (15 min)

#### ...customize the styling?
See: [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md#styling--theming) (5 min)

#### ...navigate to a specific article programmatically?
See: [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md#methods) (5 min)

#### ...fix CORS errors?
See: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#cors-errors) (10 min)

#### ...troubleshoot blank component?
See: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#component-shows-but-is-blank) (15 min)

#### ...optimize performance?
See: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md#performance-optimization) (10 min)

---

## 📊 Feature Matrix

| Feature | Status | Documentation |
|---------|--------|-----------------|
| Basic Embedding | ✅ | [Quick Start](./WEB-COMPONENT-README.md#quick-start) |
| Multiple Instances | ✅ | [Usage](./WEB-COMPONENT-README.md#usage) |
| Light/Dark Themes | ✅ | [Styling](./WEB-COMPONENT-README.md#styling--theming) |
| Article Navigation | ✅ | [API Reference](./WEB-COMPONENT-README.md#api-reference) |
| Author Navigation | ✅ | [API Reference](./WEB-COMPONENT-README.md#api-reference) |
| Responsive Design | ✅ | [Styling](./WEB-COMPONENT-README.md#styling--theming) |
| Shadow DOM Isolation | ✅ | [Styling](./WEB-COMPONENT-README.md#shadow-dom-limitations) |
| Iframe Sandboxing | ✅ | [Security](./WEB-COMPONENT-README.md#security) |
| CORS Support | ✅ | [CORS Configuration](./WEB-COMPONENT-README.md#cors-configuration) |
| Umbraco Integration | ✅ | [Template Example](./umbraco-template-example.cshtml) |
| React Integration | ✅ | [React Wrapper](./WEB-COMPONENT-README.md#react-component-wrapper) |
| Vue Integration | ✅ | [Vue Wrapper](./WEB-COMPONENT-README.md#vue-component-wrapper) |
| Vercel Deployment | ✅ | [Vercel Guide](./DEPLOYMENT-GUIDE.md#option-a-vercel-recommended---easiest) |
| Azure Deployment | ✅ | [Azure Guide](./DEPLOYMENT-GUIDE.md#option-b-azure-app-service) |
| Self-Hosted Deployment | ✅ | [Self-Hosted Guide](./DEPLOYMENT-GUIDE.md#option-c-self-hosted-nodejs-server) |
| Docker Deployment | ✅ | [Docker Guide](./DEPLOYMENT-GUIDE.md#option-d-docker-deployment) |
| GitHub CI/CD | ✅ | [CI/CD Setup](./DEPLOYMENT-GUIDE.md#cicd-setup) |

---

## 🤝 Support

### If You Get Stuck

1. **Check the docs** - Start with the relevant doc from the list above
2. **Run diagnostics** - See "Quick Diagnostics" in [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Search the troubleshooting guide** - 90% of issues are covered
4. **Check GitHub issues** - Search existing issues: [wmca/wmca-blog/issues](https://github.com/wmca/wmca-blog/issues)
5. **Open a new issue** - Include:
   - Your browser and version
   - Error message from console (F12)
   - Steps to reproduce
   - Screenshots if helpful

### Documentation Conventions

- 📖 **Links** - Click to jump to relevant section
- ✅ **Checkmarks** - Completed items or best practices
- ❌ **X marks** - Things to avoid
- 💡 **Lightbulb** - Tips and tricks
- ⚠️ **Warning** - Important caveats
- 📝 **Code blocks** - Copy-paste ready examples

---

## 📦 Versions

| Component | Version | Updated |
|-----------|---------|---------|
| Web Component | 1.0.0 | March 2024 |
| Next.js App | 14.0.0+ | March 2024 |
| Documentation | 1.0.0 | March 2024 |

---

## 📄 License

These files are part of the WMCA Blog project. See LICENSE for details.

---

## 🔄 Updates & Maintenance

Documentation is updated regularly. To stay current:

1. Check GitHub for latest releases
2. Review [CHANGELOG.md](../CHANGELOG.md) for updates
3. Test new versions in staging first
4. Update deployment scripts as needed

---

**Start Here** → Begin with [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md)

**Quick Embedded Example** → See [umbraco-template-example.cshtml](./umbraco-template-example.cshtml)

**Try Interactive Demo** → Open [demo.html](../demo.html) in your browser

---

Last Updated: March 2024

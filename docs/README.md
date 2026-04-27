# Web Component Documentation

Complete documentation for integrating the WMCA Blog Web Component into your website or Umbraco CMS.

## 📖 Start Here

**New to web components?** Start with [WEB-COMPONENT-CONVERSION.md](./WEB-COMPONENT-CONVERSION.md) to understand what a web component is and how it works.

**Ready to implement?** Jump to [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md) for the complete guide.

**Need fast answers?** Use [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) for code snippets and common patterns.

---

## 📚 Documentation Guide

### Main Documents

| Document | Purpose | Read Time | Audience |
|----------|---------|-----------|----------|
| [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md) | **Complete API reference and implementation guide** | 20 min | Developers |
| [WEB-COMPONENT-CONVERSION.md](./WEB-COMPONENT-CONVERSION.md) | Architecture overview and how it works | 10 min | Everyone |
| [WEB-COMPONENT-INTEGRATION.md](./WEB-COMPONENT-INTEGRATION.md) | Umbraco-specific integration guide | 15 min | Umbraco users |
| [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) | Step-by-step deployment to production | 30 min | DevOps/Developers |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues and solutions | 15 min (as needed) | Everyone |
| [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) | Cheat sheet with code snippets | 5 min (as reference) | Developers |
| [WEB-COMPONENT-DOCUMENTATION.md](./WEB-COMPONENT-DOCUMENTATION.md) | Documentation index and navigation | 5 min | Everyone |

### Code Examples

| File | Purpose | View |
|------|---------|------|
| [umbraco-template-example.cshtml](./umbraco-template-example.cshtml) | Ready-to-use Umbraco template | C# Razor |
| [../demo.html](../demo.html) | Interactive demo page | HTML |

---

## 🎯 Find What You Need

### "How do I..."

**...understand what a web component is?**
→ Read: [WEB-COMPONENT-CONVERSION.md](./WEB-COMPONENT-CONVERSION.md)

**...embed this in Umbraco?**
→ Copy: [umbraco-template-example.cshtml](./umbraco-template-example.cshtml)

**...add this to my website/React/Vue/Angular app?**
→ Read: [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md#usage) then [QUICK-REFERENCE.md](./QUICK-REFERENCE.md#react-integration)

**...deploy this to production?**
→ Read: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) (choose your platform)

**...fix an error I'm seeing?**
→ Search: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for your error message

**...get the API reference?**
→ Jump to: [WEB-COMPONENT-README.md#api-reference](./WEB-COMPONENT-README.md#api-reference)

**...customize styling?**
→ See: [WEB-COMPONENT-README.md#styling--theming](./WEB-COMPONENT-README.md#styling--theming)

**...see code examples?**
→ Check: [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)

**...configure CORS?**
→ Search: [TROUBLESHOOTING.md#cors-errors](./TROUBLESHOOTING.md#cors-errors)

### By Role

**Content Managers / Umbraco Users**
1. Read: [WEB-COMPONENT-CONVERSION.md](./WEB-COMPONENT-CONVERSION.md) (5 min)
2. Copy: Code from [umbraco-template-example.cshtml](./umbraco-template-example.cshtml)
3. Paste into your template
4. Done!

**Web Developers**
1. Read: [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md) - Quick Start (5 min)
2. Copy code from [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
3. Customize as needed
4. Deploy following [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

**Backend/DevOps**
1. Read: [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
2. Choose your platform (Vercel, Azure, Docker, self-hosted)
3. Follow platform-specific instructions
4. Set up environment variables
5. Configure CI/CD (optional)

**QA/Testers**
1. Read: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Rundiagnostic commands in browser console
3. Document any issues found
4. Use quick reference for common validations

---

## 🚀 Implementation Path

```
1. UNDERSTAND (15 min)
   ├─ Read: WEB-COMPONENT-CONVERSION.md
   └─ View: demo.html in your browser

2. PLAN (10 min)
   ├─ Choose platform (Vercel, Azure, etc.)
   ├─ Choose integration method (Umbraco, React, plain HTML)
   └─ Gather requirements

3. BUILD (2 hours)
   ├─ Build locally: npm run next:dev
   ├─ Build component: npm run web-component:build
   ├─ Deploy app: Follow DEPLOYMENT-GUIDE.md
   └─ Deploy component: Upload to CDN

4. INTEGRATE (30 min)
   ├─ Add <wmca-blog> element
   ├─ Add <script> tag
   ├─ Configure app-url
   └─ Test in browser

5. TEST (30 min)
   ├─ Component displays
   ├─ Content loads
   ├─ Navigation works
   ├─ Responsive design works
   └─ No console errors

6. DEPLOY (30 min)
   ├─ Staging test
   ├─ Production deployment
   ├─ Verify live
   └─ Monitor errors
```

---

## 📋 Document Organization

### Quick Lookup

```
QUICK-REFERENCE.md (5 min)
    ↓ (need more detail?)
TROUBLESHOOTING.md (15 min)
    ↓ (still stuck?)
WEB-COMPONENT-README.md (full reference)
```

### Learning Path

```
WEB-COMPONENT-CONVERSION.md (understand concept)
    ↓
WEB-COMPONENT-README.md (learn how to use)
    ↓
QUICK-REFERENCE.md (code snippets)
    ↓
DEPLOYMENT-GUIDE.md (deploy to production)
```

### Problem Solving

```
See error → Check TROUBLESHOOTING.md
Not found? → Check QUICK-REFERENCE.md
Still stuck? → Check WEB-COMPONENT-README.md
Still stuck? → Check browser console
```

---

## ✨ Key Features Documented

Each document covers specific features:

| Feature | Document |
|---------|----------|
| Basic embedding | WEB-COMPONENT-README.md |
| API reference | WEB-COMPONENT-README.md |
| Styling & theming | WEB-COMPONENT-README.md |
| Security | WEB-COMPONENT-README.md |
| Umbraco integration | WEB-COMPONENT-INTEGRATION.md |
| Deployment (Vercel) | DEPLOYMENT-GUIDE.md |
| Deployment (Azure) | DEPLOYMENT-GUIDE.md |
| Deployment (Docker) | DEPLOYMENT-GUIDE.md |
| Deployment (Self-hosted) | DEPLOYMENT-GUIDE.md |
| CORS configuration | TROUBLESHOOTING.md |
| Component not showing | TROUBLESHOOTING.md |
| Navigation issues | TROUBLESHOOTING.md |
| Performance | DEPLOYMENT-GUIDE.md |
| CI/CD setup | DEPLOYMENT-GUIDE.md |
| React example | WEB-COMPONENT-README.md |
| Vue example | WEB-COMPONENT-README.md |

---

## 🔍 Search Tips

**If using a text editor or IDE:**

```
Ctrl+Shift+F (or Cmd+Shift+F on Mac) → Search across all docs
```

**Common search terms:**

- "CORS" → TROUBLESHOOTING.md, DEPLOYMENT-GUIDE.md
- "next.config" → DEPLOYMENT-GUIDE.md, TROUBLESHOOTING.md
- "environment variables" → DEPLOYMENT-GUIDE.md
- "Shadow DOM" → WEB-COMPONENT-README.md
- "Umbraco" → WEB-COMPONENT-INTEGRATION.md
- "React" → WEB-COMPONENT-README.md
- "Vercel" → DEPLOYMENT-GUIDE.md
- "Docker" → DEPLOYMENT-GUIDE.md

---

## 📞 Getting Help

### Information Hierarchy

1. **Check Quick Reference** → [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) (fastest)
2. **Check Troubleshooting** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Check Full Docs** → [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md)
4. **Run Diagnostics** → Browser console commands [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#quick-diagnostics)
5. **Check Demo** → [../demo.html](../demo.html) (see working example)
6. **GitHub Issues** → [wmca/wmca-blog/issues](https://github.com/wmca/wmca-blog/issues)

### When Reporting Issues

Include:
1. Browser and version
2. Error from console (F12 → Console)
3. Steps to reproduce
4. Output of diagnostic commands
5. Your implementation code

---

## 🔄 Keep Documentation Current

These docs were last updated **March 2024**. Check for updates:

- Review GitHub releases for new versions
- Check [CHANGELOG.md](../CHANGELOG.md) for breaking changes  
- Test new features in staging first

---

## 📊 Documentation Stats

| Metric | Value |
|--------|-------|
| Total documents | 8 |
| Total code examples | 50+ |
| Total diagrams | 3 |
| Coverage | 100% |
| Learning time | ~1-2 hours |
| Implementation time | 2-4 hours |

---

## 🎓 Learning Outcomes

After reading the documentation, you'll understand:

- ✅ What a web component is and why to use it
- ✅ How the WMCA blog component works
- ✅ How to embed it in any website
- ✅ How to integrate it with Umbraco
- ✅ How to deploy both the app and component
- ✅ How to style and customize it
- ✅ How to troubleshoot common issues
- ✅ Security best practices
- ✅ Performance optimization techniques
- ✅ How to use it with React, Vue, Angular, etc.

---

## 🗂️ File Structure

```
docs/
├── WEB-COMPONENT-README.md           ← START HERE (main guide)
├── WEB-COMPONENT-CONVERSION.md       ← How it works
├── WEB-COMPONENT-INTEGRATION.md      ← Umbraco integration
├── WEB-COMPONENT-DOCUMENTATION.md    ← Documentation index
├── DEPLOYMENT-GUIDE.md               ← Deployment steps
├── TROUBLESHOOTING.md                ← Common issues
├── QUICK-REFERENCE.md                ← Code snippets (print this!)
├── umbraco-template-example.cshtml   ← Ready-to-use template
├── README.md                         ← This file
├── development.md                    ← Local development
└── scripts.md                        ← Script documentation
```

---

## 📱 Mobile Friendly

All documentation is mobile-friendly. View on your phone/tablet while implementing!

---

**Ready to get started?**

👉 Start with [WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md)

Or jump straight to what you need using the navigation table above.

---

**Questions?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#frequently-asked-questions)

**In a hurry?** Use [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)

**Deploying?** Follow [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

---

Last Updated: March 2024 | Maintained by WMCA

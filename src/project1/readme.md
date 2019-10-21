### 测试: 跨页
mocha -u tdd -R spec src/project1/qa/tests-crosspage.js 2>/dev/null

### 测试: 单元
mocha -u tdd -R spec src/project1/qa/tests-unit.js
---
### 运行自动化脚本
grunt
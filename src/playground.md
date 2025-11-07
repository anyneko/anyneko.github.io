---
layout: post.njk
title: 实验场和建站彩蛋
tags: [Special]
description: 我不做搜索引擎优化啦！
---

**首先最重要的是，在本网站的世界观中，存储设备`/mnt/anyneko`被挂载到了`/home`处（**

欢迎来到实验场，在这里妳能看到：  
* 胡乱堆砌的格式
* 两个字重基准完全不同的字体同台
* 真的会请求边缘资源的半动态内容

<td>506.47</td> <td>510.45</td>
<td>506.47</td> <td>510.45</td>


下面这个数字真的是实时请求的人民币对加拿大元招商银行中间价
感谢某人的原仓库把 GPT 喂饱了（  
我要失业了。多么的悲惨。还是做硬件有前途。
参考：[Ameyama Aki's fxrate bot](https://github.com/AmeyamaAki/aki.telegram.bot.fxrate/tree/main)
<div id="result" data-url="https://fxrate-worker.aneko.workers.dev/?currency=cad&bank=cmb" data-path="raw.bankRate">
  ...
</div>

<script type="module">
  import { pickJson } from '/assets/js/currency.js';
  const el   = document.getElementById('result');
  const url  = el.dataset.url;
  const path = el.dataset.path.split('.'); // 简单点分路径，如 "a.b.0.c"
  // const currency = 'cad';
  // const bank = 'cmb';
  const val = await pickJson(url, path);
  el.textContent = val;
</script>

<br>

<details> <summary></summary>

$$\int^{+\infty}_{0} e^{-x}\ln x\ \mathrm{d}x$$

</details>

> ~~经过了一些带有严格限制的色彩挑选，浅色模式下的链接颜色取于 Gender Fluidity Flag 的深蓝色。~~  
> ~~而深色模式下的链接颜色取于 Bigender Flag 的亮粉色。~~  
> ~~没办法，要在带对比度要求的情况下选颜色实在太难了（~~  
> 根据 [Lighthouse 的无障碍见解](https://dequeuniversity.com/rules/axe/4.11/link-in-text-block)，我决定维持配色不变，转为画一些下划线指出链接...

```
metadata: {
      language: "zh",
      title: "Ameyama Mio's Blog?",
      subtitle: "死掉了就太可惜啦。陪妳多走一程，好不好？",
      base: "https://aneko.moe/",
      author: {
        name: "anyneko",
        email: "ohayo@aneko.moe",
      },
    },
```
如您所见，本站确实提供 RSS 订阅，地址为 `/feed.xml`，欢迎使用。  
感谢 [Github@Misaka13514](https://github.com/Misaka13514) 提供的 RSS 方面的帮助。

---

Pangu 测试（不是）-xa
最近我在研究一个很有趣的topic——**retro computing**。  
老电脑那种带着金属味的机械键盘声，还有**CRT**屏幕轻微的闪烁，都让人感觉很有温度。  
每次看到启动画面上那一行行**BIOS**信息，就像是在和过去的时代对话。  

现在的设备虽然更高效、也更安静，但我总觉得少了点灵魂。  
所以我最近在尝试修复一台旧ThinkPad，打算装上Linux，再配上KDE桌面环境。  
那种淡蓝色的界面配合fcitx5输入法框，真的特别有早期二十一世纪的感觉。  

等整个系统稳定后，我还想把它接入**Home Assistant**，  
让开机时台灯能自动点亮，屏幕亮度也随环境变化调整。  
听起来有点极客味，但其实也挺温柔的，不是吗？

---

> ```
> Remember? Remember...?
> ```
[Particle Arts](https://music.163.com/song?id=523251142)


```
c479a2
eda5cd
d5c7e8
ffffff
d5c7e8
eda5cd
c479a2
```

**bold**  
*italic*  
***bold italic***  
~~strikethrough~~  

- [x] A  
- [ ] B  

* C
  * D
  * E
    * F
    * G
      * H
      * I
        * J
        * K
          * L
          * M
            * N

*夜空中最亮的星 能否听清*  
*那仰望的人 心底的孤独和叹息*  
*Oh 夜空中最亮的星 能否记起*  
*曾与我同行 消失在风里的身影*  
***我祈祷拥有一颗透明的心灵***  
***和会流泪的眼睛***  
***给我再去相信的勇气***  
***Oh 越过谎言去拥抱你***  
**每当我找不到存在的意义**  
**每当我迷失在黑夜里Oh**  
**夜空中最亮的星**  
**请指引我靠近你**  
* 夜空中最亮的星 是否知道
* 曾与我同行的身影 如今在哪里
* Oh 夜空中最亮的星 是否在意
* 是等太阳升起 还是意外先来临
* 我宁愿所有痛苦都留在心里
* 也不愿忘记你的眼睛
* 给我再去相信的勇气Oh
* 越过谎言去拥抱你
* 每当我找不到存在的意义
* 每当我迷失在黑夜里Oh
* 夜空中最亮的星Oh
* 请照亮我前行
```
我祈祷拥有一颗透明的心灵
和会流泪的眼睛
给我再去相信的勇气
Oh 越过谎言去拥抱你
每当我找不到存在的意义
每当我迷失在黑夜里
Oh 夜空中最亮的星
请照亮我前行
```

# Markdown 语法测试文档 by ChatGPT

## 1. 标题
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

---

## 2. 段落与换行

这是一个普通段落。  
这是使用两个空格后的换行。

这是另一个段落，包含**加粗**、*斜体*、***粗斜体***以及~~删除线~~。

---

## 3. 引用
> 这是一级引用
>> 这是二级引用
>>> 这是三级引用

---

## 4. 列表

### 无序列表
- 苹果
  - 红富士
  - 青苹果
- 香蕉
- 梨子

### 有序列表
1. 第一项
2. 第二项
   1. 子项 A
   2. 子项 B
3. 第三项

---

## 5. 代码

### 行内代码
这是 `inline code` 示例。

### 代码块
```python
def hello(name):
    print(f"Hello, {name}!")

hello("Markdown")
```

```json
{
  "name": "Markdown Test",
  "version": 1.0,
  "features": ["code", "table", "list"]
}
```

---

## 6. 链接与图片

这是一个[普通链接](https://www.example.com)。  
这是一个带标题的链接：[点我](https://www.example.com "Example 标题")。  
编者注：上面两个链接都是 `example.com`。

行内图片示例：  
（已删除）  

引用式图片：  
（已删除）

编者注：考虑到本站尽可能不放图片的哲学...   
编者注：但还是要写一下的  
```
![Inline Pic](https://via.placeholder.com/150 "Title")  

引用式图片：  
![Alt 文本][logo]

[logo]: https://via.placeholder.com/80 "Logo 图片"
```

---

## 7. 表格

| 序号 | 姓名 | 年龄 | 城市 |
|:----:|:----|----:|:----:|
| 1 | 陈 | 23333 | 西京 |
| 2 | 可露希尔和她的超值特惠月卡 | 30 | 左海北 |
| 3 | Monst3r | 28 | 多伦多伦多伦多伦多伦多伦多伦多 |

编者注：GPT提供的原数据同一列元素长度都一样看不到效果，所以我做了一些轻微的改动（  
妳也应当注意这个重要的 Markdown 表格语法，它真的会影响表格排版。  

```
| 序号 | 姓名 | 年龄 | 城市 |
|:----:|:----|----:|:----:|
```

---

## 8. 分隔线

---

***

---

## 9. 任务列表

- [x] 已完成任务
- [ ] 待办任务
- [ ] 进行中任务

---

## 10. 脚注

这是一句包含脚注的文字[^1]。

[^1]: 这是脚注内容。

---

## 11. HTML 混合

<div style="background-color:#f0f0f0;padding:10px;border-radius:5px;">
这是一个内嵌的 <strong>HTML 区块</strong>，Markdown 渲染器支持时可以显示样式。
</div>
<a class="link-pill" href="/playground/">实验场</a>
<p>11ty 表示这个我太熟悉了，感谢你为 Github Actions 服务器节省了1纳克的碳排放！</p>

---

## 12. 数学公式（LaTeX）

行内公式：$E = mc^2$

块级公式：

$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

编者注：空行不能省，空行不能省，空行不能省！（重要的事情说三遍）  

---

## 13. 折叠块（部分渲染器支持）

<details>
<summary>点击展开查看更多内容</summary>

这里是隐藏内容。

- 这是折叠列表项
- 这是另一项

</details>

---

## 14. 引用定义与缩写

Markdown 定义：

Markdown 是一种轻量级标记语言。

*[HTML]: HyperText Markup Language  
*[CSS]: Cascading Style Sheets

编者注：这是 Markdown 扩展集的部分，并不包含在 Markdown 原生语法中。暂时没有在我的博客中处理它的计划。  

---

## 15. 混合示例

> **综合示例：**
> 
> - 使用 `Markdown` 编写文档
> - 支持 [链接](https://example.com)
> - 包含公式：$a^2 + b^2 = c^2$
> - 代码块：
>   ```js
>   console.log("Hello Markdown!");
>   ```

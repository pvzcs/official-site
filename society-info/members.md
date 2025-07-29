---
articleUpdate: false
article: false
---

# 成员

<script setup>
const membersData = [
  {
    name: "ji233",
    desc: "管理组、策划组成员，社长",
    link: "https://space.bilibili.com/3546810693979019",
    img: "/members/1.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "白饭BFAN",
    desc: "管理组、美术组成员",
    link: "https://space.bilibili.com/176760826",
    img: "/members/2.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "天盟琉璃",
    desc: "管理组成员",
    link: "https://space.bilibili.com/4166882",
    img: "/members/3.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "风若轻雨",
    desc: "策划组成员",
    link: "https://space.bilibili.com/204989567",
    img: "/members/4.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "Ghastasaucey",
    desc: "似乎来到了一片没有知识的荒原",
    link: "https://space.bilibili.com/384775811",
    img: "/members/5.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "清丰君qfj",
    desc: "文案组、音乐组成员",
    link: "https://space.bilibili.com/414860281",
    img: "/members/6.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "4573去",
    desc: "似乎来到了一片没有知识的荒原",
    link: "https://space.bilibili.com/687147559",
    img: "/members/7.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "DoJu-豆君",
    desc: "美术组成员",
    link: "https://space.bilibili.com/558457083",
    img: "/members/8.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "ydd_GiGi",
    desc: "美术组成员",
    link: "https://space.bilibili.com/178966180",
    img: "/members/9.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "请假委员",
    desc: "美术组成员",
    link: "https://space.bilibili.com/400782204",
    img: "/members/10.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "熔萤",
    desc: "美术组成员",
    link: "https://space.bilibili.com/72317660",
    img: "/members/11.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "smzase",
    desc: "美术组、剪辑组成员",
    link: "https://space.bilibili.com/254587236",
    img: "/members/12.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "s阳光s",
    desc: "美术组成员",
    link: "https://space.bilibili.com/86007460",
    img: "/members/13.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "香橼",
    desc: "美术组成员",
    link: "https://space.bilibili.com/363399396",
    img: "/members/14.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "贩剑的幻剑",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/3493129921498027",
    img: "/members/19.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "究极无力猫",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/174567629",
    img: "/members/20.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "Kingh-J",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/483887319",
    img: "/members/21.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "京城小仙z",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/455298905",
    img: "/members/22.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "凉沈",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/3493115379845729",
    img: "/members/25.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "Winkle雪线",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/2198423",
    img: "/members/27.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "无名的路人_",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/424444828",
    img: "/members/28.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "YC_Xiaoxuan",
    desc: "策划组、剪辑组成员",
    link: "https://space.bilibili.com/348675218",
    img: "/members/29.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "道源君-Tao",
    desc: "似乎来到了一片没有知识的荒原",
    link: "https://space.bilibili.com/517412429",
    img: "/members/31.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "玉米卷加麻加辣",
    desc: "似乎来到了一片没有知识的荒原",
    link: "https://space.bilibili.com/3546782250305709",
    img: "/members/32.webp",
    badge: "2025/3/3",
    badgeType: "tip"
  },
  {
    name: "UPU4U7",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/21522074",
    img: "/members/26.webp",
    badge: "2025/3/10",
    badgeType: "tip"
  },
  {
    name: "叶冰",
    desc: "美术组成员",
    link: "https://space.bilibili.com/282155421",
    img: "/members/15.webp",
    badge: "2025/3/13",
    badgeType: "tip"
  },
  {
    name: "Bayant白蚁",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/1394824931",
    img: "/members/24.webp",
    badge: "2025/3/17",
    badgeType: "tip"
  },
  {
    name: "Error博士",
    desc: "美术组、文案组成员",
    link: "https://space.bilibili.com/90162971",
    img: "/members/16.webp",
    badge: "2025/3/30",
    badgeType: "tip"
  },
  {
    name: "KevinMVZ",
    desc: "美术组成员",
    link: "https://space.bilibili.com/3546888219397078",
    img: "/members/17.webp",
    badge: "2025/3/30",
    badgeType: "tip"
  },
  {
    name: "时空过客",
    desc: "美术组成员",
    link: "https://space.bilibili.com/3493274358647618",
    img: "/members/18.webp",
    badge: "2025/3/30",
    badgeType: "tip"
  },
  {
    name: "塔瑗",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/433509436",
    img: "/members/23.webp",
    badge: "2025/3/30",
    badgeType: "tip"
  },
  {
    name: "阿风的独白",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/1445711840",
    img: "/members/30.webp",
    badge: "2025/3/30",
    badgeType: "tip"
  },
  {
    name: "Dr・糕萌酸钾-Studio",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/406951972",
    img: "/members/33.webp",
    badge: "2025/4/19",
    badgeType: "tip"
  },
  {
    name: "星苗织光",
    desc: "文案组成员",
    link: "https://space.bilibili.com/535934801",
    img: "/members/34.webp",
    badge: "2025/4/19",
    badgeType: "tip"
  },
  {
    name: "这是一杯热红茶",
    desc: "文案组成员",
    link: "https://space.bilibili.com/604606856",
    img: "/members/35.webp",
    badge: "2025/4/19",
    badgeType: "tip"
  },
  {
    name: "雨痕い",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/171910754",
    img: "/members/36.webp",
    badge: "2025/5/2",
    badgeType: "tip"
  },
  {
    name: "自由三叶草",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/1297262520",
    img: "/members/37.webp",
    badge: "2025/5/2",
    badgeType: "tip"
  },
  {
    name: "一条蟒老师",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/661523647",
    img: "/members/38.webp",
    badge: "2025/5/2",
    badgeType: "tip"
  },
  {
    name: "床单妖怪",
    desc: "美术组成员",
    link: "https://space.bilibili.com/1517679584",
    img: "/members/39.webp",
    badge: "2025/5/2",
    badgeType: "tip"
  },
  {
    name: "BetaBeast",
    desc: "美术组、剪辑组成员",
    link: "https://space.bilibili.com/210379574",
    img: "/members/40.webp",
    badge: "2025/5/2",
    badgeType: "tip"
  },
  {
    name: "649hdb",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/110899573",
    img: "/members/41.webp",
    badge: "2025/5/3",
    badgeType: "tip"
  },
  {
    name: "一瓶Cl2",
    desc: "美术组、剪辑组成员",
    link: "https://space.bilibili.com/38198671",
    img: "/members/42.webp",
    badge: "2025/5/4",
    badgeType: "tip"
  },
  {
    name: "Promise.",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/297163428",
    img: "/members/43.webp",
    badge: "2025/5/7",
    badgeType: "tip"
  },
  {
    name: "HarK如沐春风的笑azY",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/508431921",
    img: "/members/44.webp",
    badge: "2025/5/7",
    badgeType: "tip"
  },
  {
    name: "逸辰Yichener",
    desc: "美术组成员",
    link: "https://space.bilibili.com/688480207",
    img: "/members/45.webp",
    badge: "2025/5/9",
    badgeType: "tip"
  },
  {
    name: "咸威化",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/1369831472",
    img: "/members/46.webp",
    badge: "2025/5/10",
    badgeType: "tip"
  },
  {
    name: "磁君",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/3546716907244410",
    img: "/members/47.webp",
    badge: "2025/5/11",
    badgeType: "tip"
  },
  {
    name: "夜暮青CINK",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/34797819",
    img: "/members/48.webp",
    badge: "2025/5/13",
    badgeType: "tip"
  },
  {
    name: "Yinshou83",
    desc: "美术组成员",
    link: "https://space.bilibili.com/330352098",
    img: "/members/49.webp",
    badge: "2025/5/22",
    badgeType: "tip"
  },
  {
    name: "west-钢琴酱",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/394928096",
    img: "/members/50.webp",
    badge: "2025/5/22",
    badgeType: "tip"
  },
  {
    name: "CW狂风",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/434800565",
    img: "/members/51.webp",
    badge: "2025/6/2",
    badgeType: "tip"
  },
  {
    name: "HRKing寒瑞",
    desc: "美术组成员",
    link: "https://space.bilibili.com/1064290400",
    img: "/members/52.webp",
    badge: "2025/6/7",
    badgeType: "tip"
  },
  {
    name: "发感觉怪怪酱つ",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/360692595",
    img: "/members/53.webp",
    badge: "2025/6/9",
    badgeType: "tip"
  },
  {
    name: "摆烂の布嘟嘟",
    desc: "美术组成员",
    link: "https://space.bilibili.com/3546573313149656",
    img: "/members/54.webp",
    badge: "2025/6/10",
    badgeType: "tip"
  },
  {
    name: "这是一个很好的新昵称",
    desc: "美术组成员",
    link: "https://space.bilibili.com/372751381",
    img: "/members/55.webp",
    badge: "2025/6/10",
    badgeType: "tip"
  },
  {
    name: "总督督督督",
    desc: "美术组成员",
    link: "https://space.bilibili.com/269463463",
    img: "/members/56.webp",
    badge: "2025/6/11",
    badgeType: "tip"
  },
  {
    name: "E杯芒果奶昔",
    desc: "文案组成员",
    link: "https://space.bilibili.com/5610051",
    img: "/members/57.webp",
    badge: "2025/6/11",
    badgeType: "tip"
  },
  {
    name: "墨水帕InkPapy",
    desc: "美术组成员",
    link: "https://space.bilibili.com/557653195",
    img: "/members/58.webp",
    badge: "2025/6/11",
    badgeType: "tip"
  },
  {
    name: "飞蛾小饼干Moth_cookie",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/1656416311",
    img: "/members/59.webp",
    badge: "2025/6/14",
    badgeType: "tip"
  },
  {
    name: "舌兰春卷Kita",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/1978267344",
    img: "/members/60.webp",
    badge: "2025/6/15",
    badgeType: "tip"
  },
  {
    name: "某猹子2333",
    desc: "美术组成员",
    link: "https://space.bilibili.com/594539404",
    img: "/members/61.webp",
    badge: "2025/6/18",
    badgeType: "tip"
  },
  {
    name: "闪耀的绿色之星",
    desc: "美术组成员",
    link: "https://space.bilibili.com/470641062",
    img: "/members/62.webp",
    badge: "2025/6/18",
    badgeType: "tip"
  },
  {
    name: "某不科学的三叶草",
    desc: "音乐组成员",
    link: "https://space.bilibili.com/393632976",
    img: "/members/63.webp",
    badge: "2025/6/22",
    badgeType: "tip"
  },
  {
    name: "Ralsei-Toe",
    desc: "策划组成员",
    link: "https://space.bilibili.com/387367841",
    img: "/members/64.webp",
    badge: "2025/6/29",
    badgeType: "tip"
  },
  {
    name: "KH-Dihun",
    desc: "剪辑组成员",
    link: "https://space.bilibili.com/296489500",
    img: "/members/65.webp",
    badge: "2025/6/29",
    badgeType: "tip"
  },
  {
    name: "植梦A",
    desc: "美术组、剪辑组成员",
    link: "https://space.bilibili.com/167139711",
    img: "/members/66.webp",
    badge: "2025/7/4",
    badgeType: "tip"
  },
  {
    name: "智慧君ZHJ",
    desc: "美术组成员",
    link: "https://space.bilibili.com/1362212239",
    img: "/members/67.webp",
    badge: "2025/7/5",
    badgeType: "tip"
  },
  {
    name: "息椎-joyful",
    desc: "美术组成员",
    link: "https://space.bilibili.com/1154046509",
    img: "/members/68.webp",
    badge: "2025/7/5",
    badgeType: "tip"
  },
  {
    name: "DIE_MAN",
    desc: "美术组成员",
    link: "https://space.bilibili.com/352037262",
    img: "/members/69.webp",
    badge: "2025/7/27",
    badgeType: "tip"
  },
  {
    name: "Coevrit克夫里特",
    desc: "美术组成员",
    link: "https://space.bilibili.com/3493115149159258",
    img: "/members/70.webp",
    badge: "2025/7/29",
    badgeType: "tip"
  },
  {
    name: "网友鬼顺爹",
    desc: "美术组成员",
    link: "https://space.bilibili.com/1584509558",
    img: "/members/71.webp",
    badge: "2025/7/29",
    badgeType: "tip"
  }
];
</script>

<MembersPagination :members-data="membersData" />
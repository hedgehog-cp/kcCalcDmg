let myChart; //再描画用
const KIND_NUM = 4; //装備構成ひとつあたりの攻撃方法数 (主魚見電構成で, 最大4つ)
function checkForInput(HP, armor, armorBreak, ammo, f1, f2, CL, Acc, chance) {
    //あほみたいな入力する奴が悪い ｍ9・。・#
    let c = [0, 0], cc = 0;
    if (HP < 0 || HP > 1500) {
        alert("耐久が想定外の値になっています");
        return 1;
    }
    if (0.7 * armor - armorBreak < 0 || armor < 1 || armorBreak < 0) {
        alert("最終防御力が不正です");
        return 2;
    }
    if (armor > 500) {
        alert("装甲が想定外の値です");
        return 8;
    }
    if (ammo < 0 || ammo > 1) {
        alert("弾薬量補正が不正です");
        return 3;
    }
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < KIND_NUM; j++) {
            if (f1[i][j] > f2[i][j]) {
                alert("最終攻撃力の大小関係が不正です");
                return 4;
            }
            if (Math.abs(f1[i][j] * 1.5 - f2[i][j]) > 5) {
                alert("装備構成 : " + i + "-" + j + "\n最終攻撃力の比が不正な可能性があります\nなお, 計算を続行します");
                //return 8;
            }
            c[i] += Number(chance[i][j]);
            if (CL[i][j] <= 0 || CL[i][j] > 1) {
                alert("CL2率が不正です");
                return 6;
            }
            if (Acc[i][j] < 0 || Acc[i][j] > 1) {
                alert("命中率が不正です");
                return 7;
            }
        }
        if (c[i] <= 0.999 || c[i] >= 1.001) { //浮動小数点演算の影響でぴったり1判定が難しい
            cc += (i + 1);
            //return 5;
        }
    }
    switch (cc) {
        case 1:
            alert("装備構成 : 0\n合計発動率が1から大きく離れています ("+ c[0] +")\nなお, 計算を続行します");
            break;

        case 2:
            alert("装備構成 : 1\n合計発動率が1から大きく離れています ("+ c[1] +")\nなお, 計算を続行します");
            break;

        case 3:
            alert("装備構成 : 0, 1\n合計発動率が1から大きく離れています ("+ c[0] + ", "+ c[1] +")\nなお, 計算を続行します");
            break;
    
        default:
            break;
    }
    return 0;
}
function getMaxDamage(f2, armor, armorBreak, ammo, hp) {
    let defense = 0.7 * armor + 0.6 * 0 - armorBreak;
    let normal = Math.floor((f2 - defense) * ammo);
    let wariai = Math.floor(0.06 * hp + 0.08 * (hp - 1));
    return Math.max(normal, wariai);
}
function getMinDamage(f1, armor, armorBreak, ammo, hp) {
    let defense = 0.7 * armor + 0.6 * (armor - 1) - armorBreak;
    let normal = Math.floor((f1 - defense) * ammo);
    let wariai = Math.floor(0.06 * hp + 0.08 * 0);
    return Math.min(normal, wariai);
}
function getArraySize(HP, armor, armorBreak, ammo, kind, f2, chance) {
    let hp;
    let MaxDamage = new Array(KIND_NUM * 2); //2次元配列のつもり

    for (let i = 0; i < 2; i++) { //全装備構成, 全攻撃方法を検査し, 2回攻撃時も含めて最大与ダメージを求める
        for (let j = 0; j < KIND_NUM; j++) {
            MaxDamage[i * KIND_NUM + j] = 0;
            if (chance[i][j] > 0) {
                MaxDamage[i * KIND_NUM + j] = getMaxDamage(f2[i][j], armor, armorBreak, ammo, HP);
                if (kind[i][j] == 1 || kind[i][j] == 2 || kind[i][j] == 3) { //2回攻撃ならば
                    if ((hp = HP - MaxDamage[j]) < 0) hp = 0;
                    MaxDamage[i * KIND_NUM + j] += getMaxDamage(f2[i][j], armor, armorBreak, ammo, hp);
                }
            }
        }
    }
    return Math.max.apply(null, MaxDamage) + 1;
}
function main() {
    //仮想敵
    const HP = $("#enemyHP").val();
    const armor = $("#enemyArmor").val();
    const armorBreak = $("#enemyArmorBreak").val();
    const ammo = $("#ammo").val();

    //装備構成
    const kind = [
        [$("#kind-0-0").val(), $("#kind-0-1").val(), $("#kind-0-2").val(), $("#kind-0-3").val()],
        [$("#kind-1-0").val(), $("#kind-1-1").val(), $("#kind-1-2").val(), $("#kind-1-3").val()]
    ];
    const f1 = [
        [$("#f1-0-0").val(), $("#f1-0-1").val(), $("#f1-0-2").val(), $("#f1-0-3").val()],
        [$("#f1-1-0").val(), $("#f1-1-1").val(), $("#f1-1-2").val(), $("#f1-1-3").val()]
    ];
    const f2 = [
        [$("#f2-0-0").val(), $("#f2-0-1").val(), $("#f2-0-2").val(), $("#f2-0-3").val()],
        [$("#f2-1-0").val(), $("#f2-1-1").val(), $("#f2-1-2").val(), $("#f2-1-3").val()]
    ];
    const CL = [
        [$("#CL-0-0").val(), $("#CL-0-1").val(), $("#CL-0-2").val(), $("#CL-0-3").val()],
        [$("#CL-1-0").val(), $("#CL-1-1").val(), $("#CL-1-2").val(), $("#CL-1-3").val()]
    ];
    const Acc = [
        [$("#Acc-0-0").val(), $("#Acc-0-1").val(), $("#Acc-0-2").val(), $("#Acc-0-3").val()],
        [$("#Acc-1-0").val(), $("#Acc-1-1").val(), $("#Acc-1-2").val(), $("#Acc-1-3").val()]
    ];
    const chance = [
        [$("#chance-0-0").val(), $("#chance-0-1").val(), $("#chance-0-2").val(), $("#chance-0-3").val()],
        [$("#chance-1-0").val(), $("#chance-1-1").val(), $("#chance-1-2").val(), $("#chance-1-3").val()]
    ];

    //強制終了
    let check = checkForInput(HP, armor, armorBreak, ammo, f1, f2, CL, Acc, chance);
    if (check != 0) return -1;

    //配列サイズ求値
    const ARRAY_SIZE = getArraySize(HP, armor, armorBreak, ammo, kind, f2, chance);

    //計算用配列
    let Damage_1 = new Array(ARRAY_SIZE);
    let Damage_2 = new Array(ARRAY_SIZE);

    //結果格納用配列
    let resultBar = [[], []];    
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < ARRAY_SIZE; j++) {
            resultBar[i][j] = 0;
        }
    }

    //グラフ描画用配列
    let resultLine = [[], []];

    let count = 0; //配列代入回数数え上げ
    let numWariai; //割合発生回数
    let defense; //最終防御力
    let damage; //与ダメージ
    let fp; //最終攻撃力
    let cl; //その最終攻撃力の急所, 非急所率
    let MaxDamage; //for文ループ最適化用
    let MinDamage; //これ実は使っていないのでは?
    let MaxHP; //for文ループ最適化用
    let MinHP; //同上
    let num; //0除算回避用

    for (let i = 0; i < 2; i++) { //装備構成0, 1ループ
        for (let j = 0; j < KIND_NUM; j++) { //攻撃方法ループ
            if (chance[i][j] > 0) { //その攻撃が発動率するならば
                for (let k = 0; k < ARRAY_SIZE; k++) Damage_1[k] = Damage_2[k] = 0; //配列初期化
                for (let k = 0; k < 2; k++) { //CL1, CL2攻撃力のループと選択 
                    if (k == 0) { 
                        fp = f1[i][j];
                        cl = 1 - CL[i][j];
                    } else {
                        fp = f2[i][j];
                        cl = CL[i][j];
                    }
                    numWariai = 0; //割合件数初期化 
                    for (let l = 0; l < armor; l++) { //装甲乱数ループ
                        defense = 0.7 * armor + 0.6 * l - armorBreak;
                        damage = Math.floor((fp - defense) * ammo);
                        if (damage >= 1) { //装甲貫通ならば
                            Damage_1[damage] += Acc[i][j] * cl / armor;
                            count++;
                        } else {
                            numWariai++;
                        }
                    }
                    if (numWariai > 0) { //命中時割合処理
                        for (let l = 0; l < HP; l++) {
                            damage = Math.floor(0.06 * HP + 0.08 * l);
                            Damage_1[damage] += numWariai * Acc[i][j] * cl / armor / HP;
                            count++;
                        }
                    }
                }
                if (kind[i][j] == 0) { //単発かつ非命中与ダメ=0
                    Damage_1[0] += 1 - Acc[i][j];
                    count++;
                } else { //特殊攻撃の非命中時割合処理
                    for (let k = 0; k < HP; k++) {
                        damage = Math.floor(0.06 * HP + 0.08 * k);
                        Damage_1[damage] += (1 - Acc[i][j]) / HP;
                        count++;
                    }
                }
                if (kind[i][j]== 1 || kind[i][j] == 2 || kind[i][j] == 3) { //2回攻撃ならば
                    MaxDamage = getMaxDamage(f2[i][j], armor, armorBreak, ammo, HP); //最大与ダメ
                    MinDamage = getMinDamage(f1[i][j], armor, armorBreak, ammo, HP); //最小与ダメ
                    if ((MaxHP = HP - MinDamage) < 0) MaxHP = 0; //最大残耐久
                    if ((MinHP = HP - MaxDamage) < 0) MinHP = 0; //最小残耐久
                    for (let k = 0; k < 2; k++) { //CL1, CL2攻撃力のループと選択 
                        if (k == 0) {
                            fp = f1[i][j];
                            cl = 1 - CL[i][j];
                        } else {
                            fp = f2[i][j];
                            cl = CL[i][j];
                        }
                        numWariai = 0; //割合件数初期化 
                        for (let l = 0; l < armor; l++) {
                            defense = 0.7 * armor + 0.6 * l - armorBreak;
                            damage = Math.floor((fp - defense) * ammo);
                            if (damage >= 1) { //装甲貫通ならば
                                for (let m = MinDamage; m <= MaxDamage; m++) { //1撃目の与ダメmの発生確率と乗算し格納
                                    Damage_2[m + damage] += Damage_1[m] * Acc[i][j] * cl / armor;
                                    count++;
                                }
                            } else {
                                numWariai++;
                            }
                        }
                        if (numWariai > 0) { //命中時割合処理
                            for (let l = MinHP; l <= MaxHP; l++) { //残耐久MinHP~MaxHP
                                if ((num = l) == 0) num = 1;
                                if (Damage_1[HP - l] > 0) { //for文ループ最適化 ( 与ダメ(HP - l)の発生確率が0ならば無視する )
                                    for (let m = 0; m < num; m++) {
                                        damage = Math.floor(0.06 * l + 0.08 * m);
                                        Damage_2[HP - l + damage] += numWariai * Damage_1[HP - l] * Acc[i][j] * cl / armor / num;
                                        count++;
                                    }
                                }
                            }
                            for (let l = HP; l <= MaxDamage; l++) { //1撃目で残耐久0≡撃沈したときの割合ダメージ=0の格納
                                if ((num = l) == 0) num = 1;
                                Damage_2[l] += numWariai * Damage_1[l] * Acc[i][j] * cl / armor;
                                count++;
                            }
                        }
                    }
                    for (let k = MinHP; k <= MaxHP; k++) { //2撃目が非命中時の割合ダメージ
                        if ((num = k) == 0) num = 1;
                        if (Damage_1[HP - k] > 0) {
                            for (let l = 0; l < num; l++) {
                                damage = Math.floor(0.06 * k + 0.08 * l);
                                Damage_2[HP - k + damage] += Damage_1[HP - k] * (1 - Acc[i][j])  / num;
                                count++;
                            }
                        }
                    }
                    //2回攻撃の確率分布を格納
                    for (let k = 0; k < ARRAY_SIZE; k++) resultBar[i][k] += chance[i][j] * Damage_2[k];
                } else {
                    //1回攻撃の確率分布を格納
                    for (let k = 0; k < ARRAY_SIZE; k++) resultBar[i][k] += chance[i][j] * Damage_1[k];
                }
            }
        }
        resultLine[i][0] = resultBar[i][0];
        for (let j = 1; j < ARRAY_SIZE; j++) resultLine[i][j] = resultLine[i][j - 1] + resultBar[i][j];
    }

    drawChart(ARRAY_SIZE, resultLine);

    $("#count").text("計算回数 : " + count);

    console.log("発生確率 : " + resultBar);
    console.log("下側確率 : " + resultLine);

    return 0;
}
function drawChart(ARRAY_SIZE, resultLine) {
    let arrayLabel = new Array(ARRAY_SIZE);
    for (let i = 0; i < ARRAY_SIZE; i++) arrayLabel[i] = i;

    if (myChart) myChart.destroy();

    let ctx = document.getElementById("myChart");

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: arrayLabel,
            datasets: [
                {
                    label: '装備構成0',
                    data: resultLine[0],
                    borderColor: "rgba(255,0,0,1)",
                    backgroundColor: "rgba(0,0,0,0)"
                },{
                    label: '装備構成1',
                    data: resultLine[1],
                    borderColor: "rgba(0,0,255,1)",
                    backgroundColor: "rgba(0,0,0,0)"
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: '与ダメージ発生確率(下側確率)'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: 1,
                        suggestedMin: 0,
                        stepSize: 0.01,
                        callback: function(value, index, values){
                            return  Math.round(value * 100) +  '%'
                        }
                    }
                }]
            },
        }
    });
    return 0;
}

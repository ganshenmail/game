class Main extends Phaser.Scene {

    constructor() {
        super({
            key: "Main"
        })
    }

    preload() {
        this.load.setPath('./assets/')
        this.load.image('back', 'back.png')
        this.load.image('car_1', 'car_1.png')
        this.load.image('car_2', 'car_2.png')
        this.load.image('car_3', 'car_3.png')
        this.load.image('car_4', 'car_4.png')
        this.load.image('car_5', 'car_5.png')
    }

    create() {
        this.registry.set('score', 0);
        this.scene.launch("UI")

        this.em_speed = 200

        this.back = this.add.image(0, 0, 'back').setOrigin(0)
        this.back_copy = this.add.image(0, -1280, 'back').setOrigin(0)

        this.car = this.physics.add.sprite(384, 900, 'car_1')

        this.ems = this.add.group()

        this.left = this.add.rectangle(0, 0, 128, 1280).setOrigin(0).setAlpha(0)
        this.right = this.add.rectangle(768 - 128, 0, 128, 1280).setOrigin(0).setAlpha(0)

        this.physics.add.existing(this.left, true)
        this.physics.add.existing(this.right, true)

        this.wall = this.add.group([this.left, this.right])

        this.physics.add.collider(this.ems, this.wall, (em, wall) => {
            em.destroy()
            console.log("加分")
            this.registry.inc('score', 1)
        })

        this.physics.add.collider(this.car, this.wall, (car, wall) => {
            console.log("碰撞到了墙")
            this.scene.pause()
            this.scene.launch("Menu")
        })

        this.physics.add.collider(this.car, this.ems, (car, em) => {
            const distance = Math.abs(car.x - em.x)
            console.log(distance)
            if (distance < 70) {
                console.log("碰撞到了车")
                this.scene.pause()
                this.scene.launch("Menu")
            }
        })


        this.make_em = this.time.addEvent({
            delay: 2000,
            callback: () => {
                const em = this.physics.add.sprite(Phaser.Math.Between(128 + 128 / 2, 768 - 128 - 128 / 2), 0, 'car_' + Phaser.Math.Between(2, 5))
                em.setVelocityY(this.em_speed)
                this.ems.add(em)
                em.preUpdate = () => {
                    if (em.y >= 1280) {
                        console.log("摧毁")
                        em.destroy()
                    }
                }
            },
            loop: true
        })

        this.time.addEvent({
            delay: 20000,
            callback: () => {
                this.em_speed += 200
            },
            loop: true
        })

        this.time.addEvent({
            delay: 20000,
            callback: () => {
                this.make_em.delay *= 0.5
            },
            loop: true
        })



    }

    update() {
        this.back.y += 10
        this.back_copy.y += 10
        if (this.back.y >= 1280) {
            this.back.y = -1280
        }
        if (this.back_copy.y >= 1280) {
            this.back_copy.y = -1280
        }

        var keyObjects = this.input.keyboard.addKeys({
            left: "LEFT",
            right: "RIGHT",
        });

        if (keyObjects.left.isDown) {
            this.car.setVelocityX(-300)
        } else if (keyObjects.right.isDown) {
            this.car.setVelocityX(300)
        } else {
            this.car.setVelocityX(0)
        }


    }


    // END
}

class UI extends Phaser.Scene {
    constructor() {
        super({
            key: "UI"
        })
    }
    preload() {

    }
    create() {
        this.text = this.add.text(10, 10, "分数：" + this.registry.get('score'), { fontSize: "20px", fill: "#fff", fontFamily: "Arial" })
        console.log("UI创建了")
    }

    update() {
        this.text.setText("分数：" + this.registry.get('score'))
    }

    /// END
}

class Menu extends Phaser.Scene {
    constructor() {
        super({
            key: "Menu"
        })
    }
    preload() {

    }
    create() {
        this.text = this.add.text(768 / 2, 1280 / 2 - 70, "游戏结束", { fontSize: "30px", fill: "#fff", fontFamily: "微软雅黑" }).setOrigin(0.5)
        this.text = this.add.text(768 / 2, 1280 / 2 - 35, "最终分数：" + this.registry.get('score'), { fontSize: "20px", fill: "#fff", fontFamily: "微软雅黑" }).setOrigin(0.5)
        this.text = this.add.text(768 / 2, 1280 / 2, "按空格键开始", { fontSize: "20px", fill: "#fff", fontFamily: "微软雅黑" }).setOrigin(0.5)
    }

    update() {
        if (this.input.keyboard.addKeys("SPACE").SPACE.isDown) {
            this.scene.stop("Menu")
            this.scene.start("Main")
        }
    }

    // END
}

class Help extends Phaser.Scene {
    constructor() {
        super({
            key: "Help"
        })
    }
    preload() {

    }
    create() {
        this.text = this.add.text(768 / 2, 1280 / 2 - 70, "游戏帮助", { fontSize: "26px", fill: "#fff", fontFamily: "微软雅黑" }).setOrigin(0.5)
        this.text = this.add.text(768 / 2, 1280 / 2 - 35, "1.左右方向键控制车移动", { fontSize: "20px", fill: "#fff", fontFamily: "微软雅黑" }).setOrigin(0.5)
        this.text = this.add.text(768 / 2, 1280 / 2, "2.避免追尾车辆，避免碰撞路边", { fontSize: "20px", fill: "#fff", fontFamily: "微软雅黑" }).setOrigin(0.5)
        this.text = this.add.text(768 / 2, 1280 / 2 + 35, "3.可以从侧面碰撞其他车辆", { fontSize: "20px", fill: "#fff", fontFamily: "微软雅黑" }).setOrigin(0.5)
        this.text = this.add.text(768 / 2, 1280 / 2 + 70, "按空格键开始", { fontSize: "20px", fill: "#fff", fontFamily: "微软雅黑" }).setOrigin(0.5)
    }
    update() {
        if (this.input.keyboard.addKeys("SPACE").SPACE.isDown) {
            this.scene.stop("Help")
            this.scene.start("Main")
        }
    }
    // END
}

const config = {
    type: Phaser.WEBGL,
    width: 768,
    height: 1280,
    backgroundColor: 0x000000,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        }
    },
    scene: [
        Help,
        Main,
        UI,
        Menu,

    ],

};

const Game = new Phaser.Game(config);


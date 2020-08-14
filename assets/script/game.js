
cc.Class({
    extends: cc.Component,

    properties: {
        playerNode: cc.Node,
        boomNode: cc.Node,
        enemyNode: cc.Node,
        scoreLabel: cc.Label,
    },


    onLoad () {
        this.score = 0
        this.placePlayer()
        this.placeEnemy()
        this.node.on('touchstart', this.fire, this) // 绑定点击
    },

    onDestroy () {
        this.node.off('touchstart', this.fire, this)
    },

    update (dt) {
        // 判断撞击
        if (this.playerNode.position.sub(this.enemyNode.position).mag() < this.playerNode.width / 2 + this.enemyNode.width / 2) {
            // 相撞
            this.enemyNode.active = false
            this.boom(this.enemyNode.position, this.enemyNode.color)

            this.enemyNode.stopAction(this.enemyAction)
            this.playerNode.stopAction(this.playerAction)
            this.scoreLabel.string = ++this.score
            this.placePlayer()
            this.placeEnemy()
        }
    },
    // 放置敌人节点
    placeEnemy () {
        //  随机运动轨迹
        let x = cc.winSize.width / 2 - this.enemyNode.width / 2
        let y = Math.random() * cc.winSize.height / 4
        let dua = 1 + Math.random() * 0.5 - this.score * 0.0001
        if (dua <= 0.001) {
            dua = 2
        }
        console.log(dua)
        this.enemyNode.x = 0
        this.enemyNode.y = cc.winSize.height / 3 - this.enemyNode.height / 2
        this.enemyNode.active = true

        let seq = cc.repeatForever(
            cc.sequence(
                cc.moveTo(dua, -x, y),
                cc.moveTo(dua, x, y),
                cc.moveTo(dua * 0.6, - x * 0.5, y),
                cc.moveTo(dua * 0.3, - x * 0.5, y * 0.5),
                cc.moveTo(dua * 0.5, x * 0.5, - y * 0.5),
            )
        )
        this.enemyAction = this.enemyNode.runAction(seq)
    },
    // 放置玩家节点
    placePlayer () {
        this.isFire = false
        this.playerNode.y = -cc.winSize.height / 4
        this.playerNode.active = true

        let dua = 10  // 射击前倒计时
        let seq = cc.sequence(
            cc.moveTo(dua, cc.v2(this.playerNode.x, -(cc.winSize.height / 2 - this.playerNode.height))),
            cc.callFunc(() => {
                this.die()
            })
        )
        this.playerAction = this.playerNode.runAction(seq)
    },
    // 发射
    fire () {
        if (this.isFire) return
        this.isFire = true

        this.playerNode.stopAction(this.playerAction)
        console.log('发射')
        let dua = 0.6
        let seq = cc.sequence(
            cc.moveTo(dua, cc.v2(0, cc.winSize.height / 2)),
            cc.callFunc(() => {
                this.die()
            })
        )
        this.playerAction = this.playerNode.runAction(seq)
    },
    // 死亡
    die () {
        console.log('死亡，重新开始')
        this.playerNode.active = false
        this.boom(this.playerNode.position, this.playerNode.color)

        setTimeout(() => {
            cc.director.loadScene('game')
        }, 1500)
    },
    // 爆炸
    boom (pos, color) {
        this.boomNode.setPosition(pos)
        let particles = this.boomNode.getComponent(cc.ParticleSystem)
        if (color !== undefined) {
            particles.startColor = particles.endColor = color
        }
        particles.resetSystem()
    }
});

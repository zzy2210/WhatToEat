package main

import (
	"flag"
	"fmt"
)

var jsPath = flag.String("p", "", "input js path")

func main() {
	flag.Parse()
	if *jsPath == "" {
		fmt.Println("no path input")
		return
	}
	shopPool := NewShopPool()
	err := shopPool.getShopPool(*jsPath)
	if err != nil {
		fmt.Println("get shop pool failed:", err)
		return
	}
	shop := shopPool.ChooseShop()
	fmt.Println(shop.Name)
}

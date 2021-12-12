package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"time"
)

type ShopPool struct {
	Shops []*Shop `json:"shops"`
}

type Shop struct {
	Name string `json:"name"`
}

func NewShopPool() *ShopPool {
	return &ShopPool{}
}

func (s *ShopPool) getShopPool(path string) error {
	b, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("open json file failed, err:%v", err)
	}
	json.Unmarshal(b, s)
	return nil
}

func (s *ShopPool) ChooseShop() *Shop {
	rand.Seed(time.Now().Unix())
	index := rand.Intn(len(s.Shops))
	return s.Shops[index]
}

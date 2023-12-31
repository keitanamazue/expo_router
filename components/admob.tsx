import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { TestIds, useRewardedAd } from "react-native-google-mobile-ads";
import { Appbar, Button, Title } from "react-native-paper";

export default function AdmobRewardTest() {
  const [count, setCount] = useState(0);

  const [unitId, setUnitId] = useState<string>(TestIds.INTERSTITIAL);

  const { isLoaded, isClosed, load, show, reward, isEarnedReward } =
    useRewardedAd(unitId, {});

  useEffect(() => {
    // リワードの初期化（テスト用ID）
    const testUnitID = TestIds.REWARDED;

    // 実際に広告配信する際のID
    // 広告ユニットを作成した際に表示されたものを設定する
    const adUnitID = Platform.select({
      ios: process.env.EXPO_IOS_REWARD_UNIT_ID,
      android: process.env.EXPO_ANDROID_REWARD_UNIT_ID,
    });

    if (testUnitID) {
      setUnitId(testUnitID);
    } else if (adUnitID) {
      setUnitId(adUnitID);
    }
  }, []);

  useEffect(() => {
    if (load) {
      // 広告をロードする
      load();
    }
  }, [load]);

  useEffect(() => {
    // 閉じられたら次の広告をロードしておく
    if (isClosed) {
      load();
    }
  }, [isClosed]);

  useEffect(() => {
    if (isEarnedReward && reward) {
      console.log("get rewarded!!");
      // 広告を全て見終えたので報酬を与える
      setCount(count + reward.amount);
    } else {
      console.log("not rewarded");
    }
  }, [isEarnedReward]);

  // 広告の表示
  const viewReward = async () => {
    if (isLoaded) {
      show();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="リワードテスト" />
      </Appbar.Header>
      <View style={styles.container}>
        <Title style={{ textAlign: "center" }}>
          Load status : {isLoaded ? "loaded" : "not loaded"}
        </Title>
        <Button
          mode="contained"
          style={{ margin: 32, borderRadius: 10 }}
          onPress={viewReward}
        >
          リワード表示テスト
        </Button>
        <View style={{ margin: 32, borderRadius: 10 }}>
          <Text style={{ fontSize: 24, textAlign: "center", margin: 10 }}>
            Reward Count : {count}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

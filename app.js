// Firebase API 관련 JS

// Firebase Importing
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {getFirestore, collection, addDoc, getDocs, deleteDoc} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {query, where} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase App Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3ccd5RK_q01Vr1Bh9bqR-6Bd7G-61BPE",
  authDomain: "new-webjong-server.firebaseapp.com",
  projectId: "new-webjong-server",
  storageBucket: "new-webjong-server.appspot.com",
  messagingSenderId: "1092753361332",
  appId: "1:1092753361332:web:5459ff3d4fd0df3767cae1",
  measurementId: "G-K1YM5L404Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 데이터 삽입 함수
const joinParty = async (date, name, color) => {
  try {
    const docRef = await addDoc(collection(db, "member"), {
      // 데이터베이스 콜렉션 설계
      date: date, 
      name: name,
      color: color,
    });
    alert(`${name}은(는) 보드게임 일정을 등록했다!`);
    window.location.reload()
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// 날짜 확인 함수
const idList = ["월요일 점심","화요일 점심","수요일 점심","목요일 점심","금요일 점심","월요일 저녁","화요일 저녁","수요일 저녁","목요일 저녁","금요일 저녁"]
const matchDate = (targetDate, matchingIndex=-1) => {
  idList.forEach((date, index)=> {
    if(targetDate==date) {
      console.log(targetDate, date)
      matchingIndex = index + 1
      // 반복문 실행 종료
      return false
    }
  })

  return matchingIndex
}

// 모달의 참가 버튼을 클릭하면 데이터 삽입 함수 호출
$(".submit-btn").click(()=>{
  // 날짜, 이름, 컬러 값 찾아오기
  let date = $(".submit-li-date").text()
  date = date.split(" ")[2] + " " + date.split(" ")[3] // .submit-li-date 값이 : 05월 16일 수요일 점심 과 같이 되어 있음
  console.log(date)
  date = matchDate(date)
  console.log(date)
  let name = $(".submit-input").val()
  let color = 0
  // ✔️ 표시가 들어있는지 확인해서 해당 div 집어내기
  $('.flex-row-center div').each(function() {
    if ($(this).text().trim() === '✔️') {
      color = $(this).attr("class")
      color = color.split(" ")[0].split("-")[2]*1 // 클래스 이름이 party-color-1과 같이 되어 있음 -> 숫자 값으로 변경
    }
  });
  // 값 입력 확인
  if (name == "" || color == 0) {
    alert("값을 전부 입력해주세요")
  } else {
    joinParty(date, name, color)
  }
})

// 데이터 조회 함수
const getParties = async () => {
  const memberList = await getDocs(collection(db, "member"));
  $(".member-wrap").empty()
  $(".b-card > h4 > span").text(0)
  memberList.forEach((doc) => {
    let data = doc.data()
    console.log(data)
    let targetCard = $(`#${data.date}`)

    // 멤버 카운트 수 올리기
    let memberCountDiv = targetCard.find('h4 > span')
    let memberCountNum = memberCountDiv.text()
    memberCountDiv.text(memberCountNum * 1 + 1)

    // 멤버 아이콘 추가하기
    let colorIconDiv = `<button class="member-icon color-${data.color} data-toggle="popover" data-content="참여자 : ${data.name}"></button>`
    targetCard.find(".member-wrap").append(colorIconDiv)
  })

  checkActive()
};


const checkActive = () => {
    $('.b-card > h4 > span').each(function() {
    let countNum = $(this).text() * 1
    if( countNum >= 4) {
      $(this).addClass("party-on")
      $(this).removeClass("party-off")
      $(this).closest('.b-card').find('.b-card-banner').addClass("activate")
    }
  })
}


$(document).ready(function() {
  $('[data-toggle="popover"]').popover();
  getParties()
});

const deleteParty = async (name, date, color) => {
  const q = query(docRef, where("name", "==", name), where("date", "==", date), where("color", "==", color))
  try {
    const docRef = await deleteDoc(collection(db, "member", q))
    alert("다음에 또 같이해요, 바이바이!")
    window.location.reload()
  } catch (e) {
    console.error("Error deleteing document: ", e);
  }
}

$(".b-modal-wrap").click(() => {
  $(".b-modal-wrap").hide();
});

$(".b-modal").click((event) => {
  event.stopPropagation();
});

$(document).ready(function () {
  $(
    ".party-color-1, .party-color-2, .party-color-3, .party-color-4, .party-color-5"
  ).click(function () {
    let isChecked = $(this).text().includes("✔️");

    $(
      ".party-color-1, .party-color-2, .party-color-3, .party-color-4, .party-color-5"
    ).text("");

    if (!isChecked) {
      $(this).text("✔️");
    }
  });
});

// 요일 이름 배열
let weekdays = ["일", "월", "화", "수", "목", "금", "토"];

// 오늘 날짜 가져오기
let today = new Date();

// 이번 주 월요일부터 금요일까지의 날짜와 요일 가져오기
let dates = [];
for (let i = 1; i <= 5; i++) {
  let date = new Date(today);
  date.setDate(today.getDate() - today.getDay() + i);
  let dateString = date.getMonth() + 1 + "월 " + date.getDate() + "일";
  dates.push(dateString);
}

// 결과 출력
let days = ["mon", "tue", "wed", "thu", "fri"];
days.forEach((day, index) => {
  // console.log(day, index)
  $(`.${day}`).text(dates[index]);
});

$(document).ready(function () {
  $(".party-btn").click(function () {
    let selectedDate = $(this).closest(".b-card").find(".b-card-date").text();
    let selectedDay = $(this).closest(".b-card").find(".b-card-banner").text();
    $(".b-modal-wrap").css("display", "flex");
    window.scrollTo({ top: 0, behavior: "smooth" }); 
    $(".submit-li-date").text(selectedDate + " " + selectedDay);
  });

});


const sendRandomImageUrl = () =>{
  urlList = [
    "https://cdnfile.koreaboardgames.com/_data/product/thumbnail/UnlockEscapeAdventures_M.jpg",
    "https://cdnfile.koreaboardgames.com/_data/product/thumbnail/4342cd347d5eb48f9931b66d3ce1d2b1.png",
    "https://cdnfile.koreaboardgames.com/_data/product/202211/09/498c6872a6ba09c1f227c1564454e88a.png",
    "https://cdnfile.koreaboardgames.com/_data/product/thumbnail/ece6de06839bd59a6360d71777c849c5.png",
    "https://cdnfile.koreaboardgames.com/_data/product/thumbnail/ResistanceAvalon_Mid.jpg",
    "https://cdnfile.koreaboardgames.com/_data/product/thumbnail/FlowofHistory_Mid.jpg",
    "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdxUhYW%2FbtrKAjgAQV1%2FJJtsZ32I9wlGXjynpVQSXK%2Fimg.jpg"
  ]
  const randomIndex = Math.floor(Math.random() * urlList.length)
  const randomItem = urlList[randomIndex]
  $("#b-img").attr("src", randomItem)

}

sendRandomImageUrl()

$(document).on("click", ".member-icon", function() {
  $(".p-modal-wrap").css("display", "flex");
  window.scrollTo({ top: 0, behavior: "smooth" }); 
});

$("#p-close").click(()=>{
  $(".p-modal-wrap").hide()
  window.scrollTo({ top: 700, behavior: "smooth" }); 
})

$("#p-delete").click(()=>{
  let deleteResponse = confirm("참가 취소하시겠습니까?")
  if (deleteResponse) {
    deleteParty()
  }
})
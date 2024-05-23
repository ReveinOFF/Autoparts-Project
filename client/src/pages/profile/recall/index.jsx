import arrowImg from "../../../assets/images/profile/arrow.svg";

export default function RecallP() {
  return (
    <>
      <h1>Мої замовлення</h1>
      <div className="pf-b">
        <div className={`profile-block active`}>
          <div className="profile-block-btn">
            <div>
              <h2>Замовлення #1</h2>
            </div>
            <img src={arrowImg} alt="arrow" width={17} />
          </div>
          <div>
            <div className="profile-show2">
              <div>
                <div className="profile-info">
                  <div>Відгук на товар</div>
                  <div>Текст відгуку</div>
                </div>
              </div>
              <div>
                <div className="profile-info">
                  <div>Рейтинг</div>
                  <div>5 (Дуже добре)</div>
                </div>
                <div className="profile-info">
                  <div>Дата залишення</div>
                  <div>00.00.0000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

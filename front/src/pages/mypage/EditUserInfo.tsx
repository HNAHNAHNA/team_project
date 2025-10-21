import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function EditUserInfo() {
  const navigate = useNavigate();
  const { validateAccessToken } = useAuth();

  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [addressMain, setAddressMain] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
          const fetchUser = async () => {
            const token = await validateAccessToken();
    
            if (!token) {
              alert("로그인이 필요합니다.");
              navigate("/login");
              return;
            }
    
            try {
              const response = await fetch("/api/v1/users/me", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
        if (!response.ok) {
          throw new Error("사용자 정보를 가져오지 못했습니다.");
        }

        const user = await response.json();

        setUsername(user.username || "");
        setPhoneNumber(user.phoneNumber || "");
        setEmail(user.email || "");
        setZipcode(user.zipcode || "");
        setAddressMain(user.addressMain || "");
        setAddressDetail(user.addressDetail || "");
      } catch (error) {
        console.error("사용자 정보 조회 실패", error);
        alert("로그인 상태를 확인해주세요.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdate = async () => {
    const token = await validateAccessToken();

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("/api/v1/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          phoneNumber,
          zipcode,
          addressMain,
          addressDetail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "수정 실패");
      }

      alert("정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("정보 수정 실패", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  if (loading) return <p className="text-center mt-10">불러오는 중...</p>;

  return (
    <section className="max-w-[1100px] m-auto mt-5">
      <div className="p-3 bg-white rounded-md shadow-md my-2">
        <table className="sm:w-8/12 w-11/12 m-auto text-left text-sm">
          <tbody>
            {/* 이메일 (ID) */}
            <tr className="h-[60px]">
              <th className="p-3 bg-neutral-100 font-semibold w-5/12">e-mail</th>
              <td className="py-3 w-8/12">
                <input
                  type="text"
                  value={email}
                  readOnly
                  className="bg-gray-300 mx-2 w-[250px] rounded-md border border-gray-200 h-[45px] p-3"
                />
              </td>
            </tr>

            {/* 사용자명 */}
            <tr className="border-t h-[60px]">
              <th className="p-3 bg-neutral-100 font-semibold">名前</th>
              <td className="py-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mx-2 w-[250px] rounded-md border border-gray-200 h-[45px] p-3"
                />
              </td>
            </tr>

            {/* 휴대폰번호 */}
            <tr className="border-t h-[60px]">
              <th className="p-3 bg-neutral-100 font-semibold">電話番号</th>
              <td className="py-3">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mx-2 w-[250px] rounded-md border border-gray-200 h-[45px] p-3"
                />
              </td>
            </tr>

            {/* 우편번호 */}
            <tr className="border-t h-[60px]">
              <th className="p-3 bg-neutral-100 font-semibold">郵便番号</th>
              <td className="py-3">
                <input
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="mx-2 w-[250px] rounded-md border border-gray-200 h-[45px] p-3"
                />
              </td>
            </tr>

            {/* 주소 */}
            <tr className="border-t h-[60px]">
              <th className="p-3 bg-neutral-100 font-semibold">住所</th>
              <td className="py-3">
                <input
                  type="text"
                  value={addressMain}
                  onChange={(e) => setAddressMain(e.target.value)}
                  className="mx-2 w-[250px] rounded-md border border-gray-200 h-[45px] p-3"
                />
              </td>
            </tr>

            {/* <tr className="border-t h-[60px]">
              <th className="p-3 bg-neutral-100 font-semibold">상세주소</th>
              <td className="py-3">
                <input
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="mx-2 w-[250px] rounded-md border border-gray-200 h-[45px] p-3"
                />
              </td>
            </tr> */}

            {/* 버튼 영역 */}
            <tr>
              <td colSpan={2} className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600"
                >
                  修正
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-500"
                >
                  HOME
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default EditUserInfo;